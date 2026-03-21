from flask import Flask, render_template, request, jsonify
import smtplib
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv

# Isso avisa o Python para carregar o nosso arquivo cofre (.env)
load_dotenv()

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/enviar', methods=['POST'])
def enviar():
    dados = request.get_json()
    
    # Agora o Python pega as informações do cofre de forma segura! (Sem os alertas do VS Code)
    seu_email = os.getenv('EMAIL_USUARIO', '')
    senha_de_app = os.getenv('EMAIL_SENHA', '')
    
    texto = f"""
    Novo contato pelo seu Portfólio!
    
    Nome: {dados.get('nome')}
    Email do cliente: {dados.get('email')}
    Assunto: {dados.get('assunto')}
    
    Mensagem:
    {dados.get('mensagem')}
    """

    msg = MIMEText(texto)
    msg['Subject'] = f"Portfólio - Novo Contato: {dados.get('assunto')}"
    msg['From'] = seu_email
    msg['To'] = seu_email 

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(seu_email, senha_de_app)
        server.sendmail(seu_email, seu_email, msg.as_string())
        server.quit()
        return jsonify({"status": "sucesso"})
    except Exception as e:
        print(f"Erro ao enviar email: {e}")
        return jsonify({"status": "erro"}), 500

if __name__ == '__main__':
    app.run(debug=True)