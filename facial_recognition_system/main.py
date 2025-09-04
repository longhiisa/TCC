import cv2
import time
import numpy as np
from typing import Dict, Any
from services.camera_service import CameraService
from services.face_recognition_service import FaceRecognitionService
from services.database_service import DatabaseService
from utils.logger import Logger
from config.database import DatabaseConfig

class FacialRecognitionSystem:
    """Sistema principal de reconhecimento facial"""
    
    def __init__(self):
        self.camera = CameraService()
        self.face_recognition = FaceRecognitionService(tolerance=0.5)
        self.db_service = DatabaseService()
        self.logger = Logger()
        
        # Configurações da interface
        self.window_name = "Sistema de Reconhecimento Facial"
        self.last_recognition = {}
        self.recognition_cooldown = 3  # segundos entre reconhecimentos do mesmo usuário
        
        # Configurações visuais
        self.colors = {
            'approved': (0, 255, 0),    # Verde
            'denied': (0, 0, 255),      # Vermelho
            'unknown': (0, 255, 255),   # Amarelo
            'text': (255, 255, 255)     # Branco
        }
    
    def initialize(self) -> bool:
        """Inicializa o sistema"""
        self.logger.info("Iniciando sistema de reconhecimento facial...")
        
        # Testa conexão com banco
        if not DatabaseConfig.test_connection():
            self.logger.error("Falha na conexão com banco de dados")
            return False
        
        # Inicializa câmera
        if not self.camera.initialize_camera():
            self.logger.error("Falha ao inicializar câmera")
            return False
        
        self.logger.info("Sistema inicializado com sucesso!")
        return True
    
    def draw_interface(self, frame: np.ndarray, recognition_results: list) -> np.ndarray:
        """Desenha interface visual no frame"""
        frame_with_ui = frame.copy()
        
        # Desenha informações para cada face detectada
        for result in recognition_results:
            top, right, bottom, left = result['location']
            user = result['user']
            confidence = result['confidence']
            recognized = result['recognized']
            
            # Define cor baseada no reconhecimento
            if recognized:
                color = self.colors['approved']
                status = "ACESSO APROVADO"
                name = user.name
                user_type = user.type.upper()
            else:
                color = self.colors['denied']
                status = "ACESSO NEGADO"
                name = "DESCONHECIDO"
                user_type = ""
            
            # Desenha retângulo ao redor da face
            cv2.rectangle(frame_with_ui, (left, top), (right, bottom), color, 2)
            
            # Desenha informações do usuário
            label_y = top - 10 if top > 50 else bottom + 25
            
            # Nome e status
            cv2.putText(frame_with_ui, f"{name}", (left, label_y), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
            
            if user_type:
                cv2.putText(frame_with_ui, f"{user_type}", (left, label_y + 20), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 1)
            
            # Status de acesso
            cv2.putText(frame_with_ui, status, (left, label_y + 40), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
            
            # Confiança
            confidence_text = f"Conf: {confidence:.2f}"
            cv2.putText(frame_with_ui, confidence_text, (left, label_y + 60), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.4, color, 1)
        
        # Desenha informações do sistema no topo
        self.draw_system_info(frame_with_ui)
        
        return frame_with_ui
    
    def draw_system_info(self, frame: np.ndarray):
        """Desenha informações do sistema"""
        height, width = frame.shape[:2]
        
        # Fundo para o texto
        cv2.rectangle(frame, (0, 0), (width, 80), (0, 0, 0), -1)
        
        # Título
        cv2.putText(frame, "SISTEMA DE CONTROLE DE ACESSO", (10, 25), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, self.colors['text'], 2)
        
        # Instruções
        cv2.putText(frame, "Pressione 'q' para sair | 'r' para recarregar usuarios", 
                   (10, 45), cv2.FONT_HERSHEY_SIMPLEX, 0.4, self.colors['text'], 1)
        
        # Status da câmera
        camera_status = "Camera: ON" if self.camera.is_camera_available() else "Camera: OFF"
        cv2.putText(frame, camera_status, (10, 65), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.4, self.colors['text'], 1)
    
    def process_recognition_results(self, results: list):
        """Processa resultados do reconhecimento e registra no banco"""
        current_time = time.time()
        
        for result in results:
            user = result['user']
            confidence = result['confidence']
            recognized = result['recognized']
            
            # Verifica cooldown para evitar spam de logs
            if recognized:
                user_key = f"user_{user.id}"
                last_time = self.last_recognition.get(user_key, 0)
                
                if current_time - last_time < self.recognition_cooldown:
                    continue
                
                self.last_recognition[user_key] = current_time
                
                # Registra acesso aprovado
                self.db_service.log_access_attempt(user.id, True, confidence)
                self.logger.access_log(user.name, True, confidence)
                
            else:
                # Registra acesso negado (com cooldown geral)
                unknown_key = "unknown"
                last_time = self.last_recognition.get(unknown_key, 0)
                
                if current_time - last_time < self.recognition_cooldown:
                    continue
                
                self.last_recognition[unknown_key] = current_time
                
                self.db_service.log_access_attempt(None, False, confidence)
                self.logger.access_log("DESCONHECIDO", False, confidence)
    
    def run(self):
        """Executa o sistema principal"""
        if not self.initialize():
            return
        
        self.logger.info("Sistema em execução. Pressione 'q' para sair.")
        
        try:
            while True:
                # Captura frame da câmera
                frame = self.camera.capture_frame()
                
                if frame is None:
                    self.logger.warning("Frame não capturado")
                    continue
                
                # Processa reconhecimento facial
                recognition_results = self.face_recognition.process_frame(frame)
                
                # Processa resultados e registra no banco
                if recognition_results:
                    self.process_recognition_results(recognition_results)
                
                # Desenha interface
                frame_with_ui = self.draw_interface(frame, recognition_results)
                
                # Exibe frame
                cv2.imshow(self.window_name, frame_with_ui)
                
                # Verifica comandos do teclado
                key = cv2.waitKey(1) & 0xFF
                
                if key == ord('q'):
                    self.logger.info("Encerrando sistema...")
                    break
                elif key == ord('r'):
                    self.logger.info("Recarregando usuários...")
                    self.face_recognition.reload_faces()
                elif key == ord('l'):
                    # Mostra logs recentes
                    logs = self.db_service.get_access_logs(10)
                    self.logger.info(f"Últimos {len(logs)} acessos:")
                    for log in logs:
                        name = log.get('name', 'DESCONHECIDO')
                        status = 'APROVADO' if log['access_granted'] else 'NEGADO'
                        confidence = log.get('confidence_score', 0)
                        time_str = log['access_time'].strftime('%H:%M:%S')
                        self.logger.info(f"  {time_str} - {name} - {status} - {confidence:.2f}")
                
        except KeyboardInterrupt:
            self.logger.info("Sistema interrompido pelo usuário")
        
        except Exception as e:
            self.logger.error(f"Erro durante execução: {e}")
        
        finally:
            self.cleanup()
    
    def cleanup(self):
        """Limpa recursos do sistema"""
        self.camera.release_camera()
        cv2.destroyAllWindows()
        self.logger.info("Recursos liberados. Sistema encerrado.")


def main():
    """Função principal"""
    system = FacialRecognitionSystem()
    system.run()


if __name__ == "__main__":
    main()