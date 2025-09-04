from typing import List, Optional
from config.database import DatabaseConfig
from models.user_model import User
from utils.logger import Logger

class DatabaseService:
    """Serviço para operações no banco de dados"""
    
    def __init__(self):
        self.logger = Logger()
    
    def get_all_users(self) -> List[User]:
        """Busca todos os usuários ativos"""
        users = []
        connection = DatabaseConfig.get_connection()
        
        if not connection:
            self.logger.error("Falha na conexão com banco")
            return users
        
        try:
            cursor = connection.cursor(dictionary=True)
            query = "SELECT * FROM users WHERE active = TRUE"
            cursor.execute(query)
            
            for row in cursor.fetchall():
                user = User.from_dict(row)
                users.append(user)
                
            self.logger.info(f"Carregados {len(users)} usuários do banco")
            
        except Exception as e:
            self.logger.error(f"Erro ao buscar usuários: {e}")
        finally:
            cursor.close()
            connection.close()
            
        return users
    
    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Busca usuário por ID"""
        connection = DatabaseConfig.get_connection()
        
        if not connection:
            return None
        
        try:
            cursor = connection.cursor(dictionary=True)
            query = "SELECT * FROM users WHERE id = %s AND active = TRUE"
            cursor.execute(query, (user_id,))
            
            row = cursor.fetchone()
            if row:
                return User.from_dict(row)
                
        except Exception as e:
            self.logger.error(f"Erro ao buscar usuário {user_id}: {e}")
        finally:
            cursor.close()
            connection.close()
            
        return None
    
    def add_user(self, user: User) -> bool:
        """Adiciona novo usuário"""
        connection = DatabaseConfig.get_connection()
        
        if not connection:
            return False
        
        try:
            cursor = connection.cursor()
            query = """
                INSERT INTO users (name, email, type, face_encoding, photo_path, active)
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            
            values = (
                user.name,
                user.email,
                user.type,
                user.face_encoding_to_json(),
                user.photo_path,
                user.active
            )
            
            cursor.execute(query, values)
            user.id = cursor.lastrowid
            
            self.logger.info(f"Usuário {user.name} adicionado com ID {user.id}")
            return True
            
        except Exception as e:
            self.logger.error(f"Erro ao adicionar usuário: {e}")
            return False
        finally:
            cursor.close()
            connection.close()
    
    def log_access_attempt(self, user_id: Optional[int], granted: bool, confidence: float = 0.0):
        """Registra tentativa de acesso"""
        connection = DatabaseConfig.get_connection()
        
        if not connection:
            return
        
        try:
            cursor = connection.cursor()
            query = """
                INSERT INTO access_logs (user_id, access_granted, confidence_score)
                VALUES (%s, %s, %s)
            """
            
            cursor.execute(query, (user_id, granted, confidence))
            
            status = "APROVADO" if granted else "NEGADO"
            user_info = f"ID:{user_id}" if user_id else "DESCONHECIDO"
            self.logger.info(f"Acesso {status} - {user_info} - Confiança: {confidence:.2f}")
            
        except Exception as e:
            self.logger.error(f"Erro ao registrar log de acesso: {e}")
        finally:
            cursor.close()
            connection.close()
    
    def get_access_logs(self, limit: int = 100) -> List[dict]:
        """Busca logs de acesso recentes"""
        logs = []
        connection = DatabaseConfig.get_connection()
        
        if not connection:
            return logs
        
        try:
            cursor = connection.cursor(dictionary=True)
            query = """
                SELECT al.*, u.name, u.type 
                FROM access_logs al
                LEFT JOIN users u ON al.user_id = u.id
                ORDER BY al.access_time DESC
                LIMIT %s
            """
            
            cursor.execute(query, (limit,))
            logs = cursor.fetchall()
            
        except Exception as e:
            self.logger.error(f"Erro ao buscar logs: {e}")
        finally:
            cursor.close()
            connection.close()
            
        return logs