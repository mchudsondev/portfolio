import os
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import resend

# Carrega as variáveis de ambiente (útil para desenvolvimento local)
load_dotenv()

app = Flask(__name__)

# Configura a chave da API do Resend (Trancada com segurança no cofre do Render)
resend.api_key = os.getenv("RESEND_API_KEY")

# Define o e-mail de destino fixo (o mesmo cadastrado e validado na sua conta do Resend)
EMAIL_DESTINO = "mchudson.dev@gmail.com"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/enviar', methods=['POST'])
def enviar():
    try:
        # Pega os dados que vieram do JavaScript (Front-end)
        dados = request.get_json()
        
        # Extrai os dados garantindo que não tenham espaços em branco nas pontas
        nome = dados.get('nome', '').strip()
        email_cliente = dados.get('email', '').strip()
        assunto = dados.get('assunto', '').strip()
        mensagem = dados.get('mensagem', '').strip()

        # Melhoria 1: Validação de Segurança - Bloqueia formulários vazios (Robôs)
        if not nome or not email_cliente or not mensagem:
            print("Tentativa de envio bloqueada: Campos obrigatórios vazios.")
            return jsonify({"status": "erro", "detalhes": "Preencha todos os campos obrigatórios."}), 400

        # Monta a carta para a API do Resend
        params = {
            "from": "Portfolio Hudson <onboarding@resend.dev>",
            "to": [EMAIL_DESTINO], # O formato exato que o Resend exige: String dentro de uma Lista
            "reply_to": email_cliente, 
            "subject": f"Novo Contato: {assunto} - {nome}",
            # Melhoria 2: HTML Estilizado para a sua caixa de entrada
            "html": f"""
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #0a0e27; padding: 20px; text-align: center;">
                        <h2 style="color: #00d4ff; margin: 0;">Nova mensagem do seu Portfólio! 🚀</h2>
                    </div>
                    <div style="padding: 20px; background-color: #f9f9f9;">
                        <p style="margin-bottom: 5px;"><strong>👤 Nome:</strong> {nome}</p>
                        <p style="margin-bottom: 5px;"><strong>✉️ Email:</strong> {email_cliente}</p>
                        <p style="margin-bottom: 20px;"><strong>📌 Assunto:</strong> {assunto}</p>
                        <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
                        <p style="margin-bottom: 10px;"><strong>💬 Mensagem:</strong></p>
                        <blockquote style="border-left: 4px solid #00d4ff; padding: 15px; background-color: #fff; font-style: italic; border-radius: 4px; margin: 0;">
                            {mensagem}
                        </blockquote>
                    </div>
                </div>
            """
        }

        # Dispara o e-mail pela porta segura da internet (Ignorando o bloqueio do Render)
        email_response = resend.Emails.send(params)  # type: ignore
        
        # Registra o sucesso no terminal
        id_envio = email_response.get('id', 'ID não retornado') if isinstance(email_response, dict) else email_response
        print(f"✅ E-mail enviado com sucesso! ID: {id_envio}")

        return jsonify({"status": "sucesso"})

    except Exception as e:
        # Registra o erro CRÍTICO no terminal do Render para debug facilitado
        print(f"🚨 Erro CRÍTICO ao enviar via Resend: {str(e)}")
        return jsonify({"status": "erro", "detalhes": "Erro interno do servidor."}), 500

if __name__ == '__main__':
    app.run(debug=True)