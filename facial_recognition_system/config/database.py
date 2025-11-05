import mysql.connector
from mysql.connector import Error

class DatabaseConfig:
    """Configurações do banco de dados MySQL"""
    
    HOST = 'localhost'
    DATABASE = 'facial_recognition_db'  # nome fixo para este sistema
    USER = 'root'        # altere se necessário
    PASSWORD = 'sua_senha'  # altere para sua senha
    PORT = 3307
    
    @classmethod
    def get_connection(cls):
        """Retorna uma conexão com o banco de dados"""
        try:
            connection = mysql.connector.connect(
                host=cls.HOST,
                database=cls.DATABASE,
                user=cls.USER,
                password=cls.PASSWORD,
                port=cls.PORT,
                autocommit=True
            )
            if connection.is_connected():
                return connection
        except Error as e:
            print(f"❌ Erro ao conectar ao MySQL: {e}")
            return None
    
    @classmethod
    def test_connection(cls):
        """Testa a conexão com o banco"""
        conn = cls.get_connection()
        if conn:
            print("✅ Conexão com banco de dados estabelecida!")
            conn.close()
            return True
        else:
            print("❌ Falha na conexão com banco de dados!")
            return False
