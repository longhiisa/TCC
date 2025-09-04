import cv2
import numpy as np
from typing import List, Tuple

class FaceDetector:
    """Utilitário para detecção de faces usando OpenCV"""
    
    def __init__(self):
        # Carrega classificador Haar Cascade para detecção de faces
        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        )
    
    def detect_faces(self, frame: np.ndarray) -> List[Tuple[int, int, int, int]]:
        """
        Detecta faces em um frame usando Haar Cascade
        
        Args:
            frame: Frame da imagem
            
        Returns:
            Lista de tuplas (x, y, w, h) das faces detectadas
        """
        # Converte para escala de cinza
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Detecta faces
        faces = self.face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(30, 30),
            flags=cv2.CASCADE_SCALE_IMAGE
        )
        
        return faces.tolist()
    
    def draw_face_rectangles(self, frame: np.ndarray, faces: List[Tuple[int, int, int, int]], 
                           color: Tuple[int, int, int] = (0, 255, 0), thickness: int = 2) -> np.ndarray:
        """
        Desenha retângulos ao redor das faces detectadas
        
        Args:
            frame: Frame da imagem
            faces: Lista de faces (x, y, w, h)
            color: Cor do retângulo (B, G, R)
            thickness: Espessura da linha
            
        Returns:
            Frame com retângulos desenhados
        """
        frame_copy = frame.copy()
        
        for (x, y, w, h) in faces:
            cv2.rectangle(frame_copy, (x, y), (x + w, y + h), color, thickness)
        
        return frame_copy
    
    def extract_face_roi(self, frame: np.ndarray, x: int, y: int, w: int, h: int, 
                        padding: int = 20) -> np.ndarray:
        """
        Extrai região de interesse (ROI) da face
        
        Args:
            frame: Frame original
            x, y, w, h: Coordenadas da face
            padding: Pixels extras ao redor da face
            
        Returns:
            Imagem da face extraída
        """
        # Adiciona padding e garante que não saia dos limites da imagem
        x1 = max(0, x - padding)
        y1 = max(0, y - padding)
        x2 = min(frame.shape[1], x + w + padding)
        y2 = min(frame.shape[0], y + h + padding)
        
        return frame[y1:y2, x1:x2]