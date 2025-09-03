from config.db import get_connection

def listar_alunos():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, nome, foto FROM alunos")
    alunos = cursor.fetchall()
    conn.close()
    return alunos
