import cv2
import numpy as np
from typing import Optional
from utils.logger import Logger

class CameraService:
    """Serviço para captura de vídeo da câmera"""
    
    def __init__(self, camera_index: int = 0):
        self.camera_index = camera_index
        self.cap = None
        self.logger = Logger()
        self.frame_width = 640
        self.frame_height = 480
    
    def initialize_camera(self) -> bool:
        """Inicializa a câmera"""
        try:
            self.cap = cv2.VideoCapture(self.camera_index)
            
            if not self.cap.isOpened():
                self.logger.error(f"Não foi possível abrir câmera {self.camera_index}")
                return False
            
            # Configura resolução
            self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.frame_width)
            self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.frame_height)
            self.cap.set(cv2.CAP_PROP_FPS, 30)
            
            self.logger.info(f"Câmera {self.camera_index} inicializada")
            return True
            
        except Exception as e:
            self.logger.error(f"Erro ao inicializar câmera: {e}")
            return False
    
    def capture_frame(self) -> Optional[np.ndarray]:
        """Captura um frame da câmera"""
        if not self.cap or not self.cap.isOpened():
            return None
        
        try:
            ret, frame = self.cap.read()
            
            if ret:
                return frame
            else:
                self.logger.warning("Falha na captura do frame")
                return None
                
        except Exception as e:
            self.logger.error(f"Erro na captura: {e}")
            return None
    
    def release_camera(self):
        """Libera recursos da câmera"""
        if self.cap:
            self.cap.release()
            self.logger.info("Câmera liberada")
    
    def is_camera_available(self) -> bool:
        """Verifica se a câmera está disponível"""
        return self.cap is not None and self.cap.isOpened()
    
    def get_camera_properties(self) -> dict:
        """Retorna propriedades da câmera"""
        if not self.is_camera_available():
            return {}
        
        return {
            'width': int(self.cap.get(cv2.CAP_PROP_FRAME_WIDTH)),
            'height': int(self.cap.get(cv2.CAP_PROP_FRAME_HEIGHT)),
            'fps': int(self.cap.get(cv2.CAP_PROP_FPS))
        }