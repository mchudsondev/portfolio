import os
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import resend

# Carrega as variáveis de segurança
load_dotenv()

app = Flask(__name__)

# Configura as chaves secretas do Resend
resend.api_key = os.getenv("RESEND_API_KEY")
MEU_EMAIL = os.getenv("MEU_EMAIL")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/enviar', methods=['POST'])
def enviar():
    try:
        # Pega os dados que vieram do JavaScript (Front-end)
        dados = request.get_json()
        nome = dados.get('nome')
        email_cliente = dados.get('email')
        assunto = dados.get('assunto')
        mensagem = dados.get('mensagem')

        # Monta a carta para a API do Resend
        params = {
            "from": "Portfolio Hudson <onboarding@resend.dev>",
            "to": [MEU_EMAIL],
            "reply_to": email_cliente, # Se você responder o e-mail, vai para o cliente
            "subject": f"Novo Contato: {assunto} - {nome}",
            "html": f"""
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #00d4ff;">Nova mensagem do seu Portfólio! 🚀</h2>
                    <p><strong>Nome do Cliente:</strong> {nome}</p>
                    <p><strong>Email do Cliente:</strong> {email_cliente}</p>
                    <p><strong>Assunto:</strong> {assunto}</p>
                    <hr>
                    <p><strong>Mensagem:</strong></p>
                    <blockquote style="border-left: 4px solid #00d4ff; padding-left: 10px; font-style: italic;">
                        {mensagem}
                    </blockquote>
                </div>
            """
        }

        # Dispara o e-mail pela porta segura da internet (Ignora o bloqueio do Render!)
        email_response = resend.Emails.send(params)
        print(f"E-mail enviado com sucesso! ID: {email_response}")

        return jsonify({"status": "sucesso"})

    except Exception as e:
        print(f"Erro ao enviar via Resend: {e}")
        return jsonify({"status": "erro", "detalhes": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)