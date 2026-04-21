import os
from flask import Flask, request, jsonify
import psycopg2
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)

DATABASE_URL = os.getenv("DATABASE_URL")


def get_db_connection():
    return psycopg2.connect(DATABASE_URL)

@app.route('/init_user',methods=['GET'])
def init_table():
    conn = get_db_connection()
    cur = conn.cursor();

    cur.execute("""
            create table if not exists users(
                    id Serial primary key,
                    name varchar(20) not null,
                    email varchar(150) unique
                );
    """)
    conn.commit()
    cur.close()
    conn.close()

    return "USERS TABLE IS CREATED....!"

@app.route('/users',methods=['POST'])
def create_user():
    data = request.json
    name = data.get('name')
    email = data.get('email')

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("insert into users(name,email) values(%s , %s) RETURNING id",(name,email))

    user_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"id":user_id, "name":name, "email":email})

@app.route('/users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT id, name, email FROM users;")
    users = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify([
        {"id": u[0], "name": u[1], "email": u[2]}
        for u in users
    ])
@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.json
    name = data.get('name')
    email = data.get('email')

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        UPDATE users
        SET name = %s, email = %s
        WHERE id = %s
        RETURNING id, name, email;
    """, (name, email, user_id))

    updated_user = cur.fetchone()
    conn.commit()

    cur.close()
    conn.close()

    if updated_user:
        return jsonify({
            "id": updated_user[0],
            "name": updated_user[1],
            "email": updated_user[2]
        })
    else:
        return jsonify({"error": "User not found"}), 404
    
@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("DELETE FROM users WHERE id = %s RETURNING id;", (user_id,))
    deleted = cur.fetchone()

    conn.commit()
    cur.close()
    conn.close()

    if deleted:
        return jsonify({"message": f"User {user_id} deleted successfully"})
    else:
        return jsonify({"error": "User not found"}), 404
    

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0',port=3000)