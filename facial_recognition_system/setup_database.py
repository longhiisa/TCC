import mysql.connector
from mysql.connector import Error
from config.database import DatabaseConfig

class DatabaseSetup:
    """Classe para configuração inicial do banco"""
    
    def __init__(self):
        self.config = DatabaseConfig()
    
    def create_database(self):
        """Cria o banco de dados"""
        try:
            # Conecta sem especificar database
            connection = mysql.connector.connect(
                host=self.config.HOST,
                user=self.config.USER,
                password=self.config.PASSWORD,
                port=self.config.PORT
            )
            
            cursor = connection.cursor()
            
            # Cria database se não existir
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {self.config.DATABASE}")
            print(f"✅ Database '{self.config.DATABASE}' criado/verificado")
            
            cursor.close()
            connection.close()
            return True
            
        except Error as e:
            print(f"❌ Erro ao criar database: {e}")
            return False
    
    def create_tables(self):
        """Cria as tabelas necessárias"""
        connection = self.config.get_connection()
        
        if not connection:
            print("❌ Falha na conexão com banco")
            return False
        
        try:
            cursor = connection.cursor()
            
            # Tabela users
            users_table = """
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                type ENUM('aluno', 'professor') NOT NULL,
                face_encoding TEXT NOT NULL,
                photo_path VARCHAR(255),
                active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                
                INDEX idx_email (email),
                INDEX idx_type (type),
                INDEX idx_active (active)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            """
            
            cursor.execute(users_table)
            print("✅ Tabela 'users' criada/verificada")
            
            # Tabela access_logs
            logs_table = """
            CREATE TABLE IF NOT EXISTS access_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NULL,
                access_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                access_granted BOOLEAN NOT NULL,
                confidence_score FLOAT DEFAULT 0.0,
                
                INDEX idx_access_time (access_time),
                INDEX idx_user_id (user_id),
                INDEX idx_access_granted (access_granted),
                
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            """
            
            cursor.execute(logs_table)
            print("✅ Tabela 'access_logs' criada/verificada")
            
            cursor.close()
            connection.close()
            return True
            
        except Error as e:
            print(f"❌ Erro ao criar tabelas: {e}")
            return False
    
    def insert_sample_data(self):
        """Insere dados de exemplo (opcional)"""
        connection = self.config.get_connection()
        
        if not connection:
            return False
        
        try:
            cursor = connection.cursor()
            
            # Verifica se já existem usuários
            cursor.execute("SELECT COUNT(*) FROM users")
            count = cursor.fetchone()[0]
            
            if count > 0:
                print("ℹ️  Dados de exemplo não inseridos - usuários já existem")
                return True
            
            print("📝 Inserindo dados de exemplo...")
            
            # Usuários de exemplo (sem face_encoding real - será adicionado via script)
            sample_users = [
                ("João Silva", "joao.silva@email.com", "professor", "[]"),
                ("Maria Santos", "maria.santos@email.com", "aluno", "[]"),
                ("Pedro Costa", "pedro.costa@email.com", "aluno", "[]")
            ]
            
            insert_query = """
            INSERT INTO users (name, email, type, face_encoding) 
            VALUES (%s, %s, %s, %s)
            """
            
            for user_data in sample_users:
                try:
                    cursor.execute(insert_query, user_data)
                    print(f"  ✅ Usuário exemplo: {user_data[0]}")
                except Error as e:
                    print(f"  ❌ Erro ao inserir {user_data[0]}: {e}")
            
            cursor.close()
            connection.close()
            
            print("💡 Nota: Use 'python add_user.py' para cadastrar usuários com fotos")
            return True
            
        except Error as e:
            print(f"❌ Erro ao inserir dados de exemplo: {e}")
            return False
    
    def setup_complete(self):
        """Executa configuração completa"""
        print("🚀 CONFIGURAÇÃO DO BANCO DE DADOS")
        print("="*50)
        
        steps = [
            ("Criando database", self.create_database),
            ("Criando tabelas", self.create_tables),
            ("Testando conexão", self.config.test_connection)
        ]
        
        for step_name, step_function in steps:
            print(f"\n📋 {step_name}...")
            
            if not step_function():
                print(f"❌ Falha em: {step_name}")
                return False
        
        # Pergunta sobre dados de exemplo
        print(f"\n🤔 Deseja inserir usuários de exemplo? (s/N): ", end="")
        response = input().strip().lower()
        
        if response in ['s', 'sim', 'y', 'yes']:
            self.insert_sample_data()
        
        print("\n🎉 Configuração do banco concluída!")
        print("\n📋 Próximos passos:")
        print("  1. Execute 'python add_user.py' para cadastrar usuários")
        print("  2. Execute 'python main.py' para iniciar o sistema")
        
        return True


def main():
    """Função principal"""
    setup = DatabaseSetup()
    setup.setup_complete()


if __name__ == "__main__":
    main()