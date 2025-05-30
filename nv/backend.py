from flask import Flask, request, jsonify
from flask_cors import CORS
import bcrypt
import pickle
import os

app = Flask(__name__)
CORS(app)

USERS_FILE = 'users.pkl'

# Função para carregar usuários do disco
def load_users():
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'rb') as f:
            return pickle.load(f)
    return []

# Função para salvar usuários no disco
def save_users(users):
    with open(USERS_FILE, 'wb') as f:
        pickle.dump(users, f)

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    users = load_users()

    # Verificar duplicidade de CPF
    if any(u['cpf'] == data['cpf'] for u in users):
        return jsonify({'error': 'CPF já cadastrado'}), 400

    # Criar hash da senha
    hashed = bcrypt.hashpw(data['password'].encode(), bcrypt.gensalt())

    user = {
        'name': data['name'],
        'cpf': data['cpf'],
        'birthdate': data['birthdate'],
        'email': data['email'],
        'phone': data['phone'],
        'password': hashed
    }

    users.append(user)
    save_users(users)

    return jsonify({'message': 'Cadastro realizado com sucesso!'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    users = load_users()
    
    user = next((u for u in users if u['cpf'] == data['cpf']), None)
    if not user or not bcrypt.checkpw(data['password'].encode(), user['password']):
        return jsonify({'error': 'CPF ou senha inválidos'}), 401

    return jsonify({'message': 'Login bem-sucedido', 'name': user['name']}), 200

if __name__ == '__main__':
    app.run(debug=True)
