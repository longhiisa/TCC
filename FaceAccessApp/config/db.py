import mysql2.connector

def get_connection():
    return mysql2.connector.connect(
        host="localhost",
        user="root",
        password="sua_senha",
        database="escola"
    )
