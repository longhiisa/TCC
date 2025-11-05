import logging
import sys
from datetime import datetime
from typing import Optional

class Logger:
    """Sistema de logging para o projeto"""
    
    def __init__(self, name: Optional[str] = None, level: int = logging.INFO):
        self.logger = logging.getLogger(name or __name__)
        self.logger.setLevel(level)
        
        # Evita duplicação de handlers
        if not self.logger.handlers:
            self._setup_handlers()
    
    def _setup_handlers(self):
        """Configura handlers de log"""
        # Formato das mensagens
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        
        # Handler para console
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setFormatter(formatter)
        self.logger.addHandler(console_handler)
        
        # Handler para arquivo (opcional)
        try:
            file_handler = logging.FileHandler('facial_recognition.log')
            file_handler.setFormatter(formatter)
            self.logger.addHandler(file_handler)
        except Exception:
            pass  # Se não conseguir criar arquivo, continua só com console
    
    def info(self, message: str):
        """Log de informação"""
        self.logger.info(message)
    
    def warning(self, message: str):
        """Log de aviso"""
        self.logger.warning(message)
    
    def error(self, message: str):
        """Log de erro"""
        self.logger.error(message)
    
    def debug(self, message: str):
        """Log de debug"""
        self.logger.debug(message)
    
    def access_log(self, user_name: str, access_granted: bool, confidence: float):
        """Log específico para controle de acesso"""
        status = "PERMITIDO" if access_granted else "NEGADO"
        message = f"ACESSO {status} - Usuário: {user_name} - Confiança: {confidence:.2f}"
        
        if access_granted:
            self.info(message)
        else:
            self.warning(message)