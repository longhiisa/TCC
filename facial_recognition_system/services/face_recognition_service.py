import face_recognition
import numpy as np
from typing import List, Optional, Tuple
from models.user_model import User
from services.database_service import DatabaseService
from utils.logger import Logger

class FaceRecognitionService:
    """Serviço de reconhecimento facial"""
    
    def __init__(self, tolerance: float = 0.5):
        self.tolerance = tolerance  # Quanto menor, mais restritivo
        self.known_faces = []
        self.known_users = []
        self.db_service = DatabaseService()
        self.logger = Logger()
        self.load_known_faces()
    
    def load_known_faces(self):
        """Carrega faces conhecidas do banco de dados"""
        users = self.db_service.get_all_users()
        self.known_faces = []
        self.known_users = []
        
        for user in users:
            if user.face_encoding is not None:
                self.known_faces.append(user.face_encoding)
                self.known_users.append(user)
        
        self.logger.info(f"Carregadas {len(self.known_faces)} faces conhecidas")
    
    def encode_face(self, face_image) -> Optional[np.ndarray]:
        """
        Codifica uma face em um array de características
        
        Args:
            face_image: Imagem da face (array numpy)
            
        Returns:
            Array de codificação da face ou None se não encontrar face
        """
        try:
            # Converte BGR (OpenCV) para RGB
            rgb_image = face_image[:, :, ::-1]
            
            # Encontra faces na imagem
            face_locations = face_recognition.face_locations(rgb_image)
            
            if len(face_locations) == 0:
                return None
            
            # Pega apenas a primeira face encontrada
            face_encodings = face_recognition.face_encodings(rgb_image, face_locations)
            
            if len(face_encodings) > 0:
                return face_encodings[0]
            
        except Exception as e:
            self.logger.error(f"Erro ao codificar face: {e}")
        
        return None
    
    def recognize_face(self, face_encoding: np.ndarray) -> Tuple[Optional[User], float]:
        """
        Reconhece uma face comparando com faces conhecidas
        
        Args:
            face_encoding: Codificação da face a ser reconhecida
            
        Returns:
            Tupla (usuário_reconhecido, confiança)
        """
        if len(self.known_faces) == 0:
            return None, 0.0
        
        try:
            # Compara com todas as faces conhecidas
            distances = face_recognition.face_distance(self.known_faces, face_encoding)
            
            # Encontra a menor distância (maior similaridade)
            min_distance = np.min(distances)
            min_index = np.argmin(distances)
            
            # Calcula confiança (1 - distância normalizada)
            confidence = max(0, 1 - min_distance)
            
            # Verifica se está dentro da tolerância
            if min_distance <= self.tolerance:
                recognized_user = self.known_users[min_index]
                self.logger.info(f"Face reconhecida: {recognized_user.name} (confiança: {confidence:.2f})")
                return recognized_user, confidence
            else:
                self.logger.warning(f"Face não reconhecida (distância: {min_distance:.2f})")
                return None, confidence
        
        except Exception as e:
            self.logger.error(f"Erro no reconhecimento: {e}")
        
        return None, 0.0
    
    def process_frame(self, frame) -> List[dict]:
        """
        Processa um frame da câmera buscando faces
        
        Args:
            frame: Frame da câmera (array numpy)
            
        Returns:
            Lista de dicionários com informações das faces detectadas
        """
        results = []
        
        try:
            # Reduz tamanho para acelerar processamento
            small_frame = frame[::4, ::4]
            rgb_small = small_frame[:, :, ::-1]
            
            # Encontra todas as faces no frame
            face_locations = face_recognition.face_locations(rgb_small)
            face_encodings = face_recognition.face_encodings(rgb_small, face_locations)
            
            for (top, right, bottom, left), encoding in zip(face_locations, face_encodings):
                # Ajusta coordenadas para o frame original
                top *= 4
                right *= 4
                bottom *= 4
                left *= 4
                
                # Tenta reconhecer a face
                user, confidence = self.recognize_face(encoding)
                
                result = {
                    'location': (top, right, bottom, left),
                    'user': user,
                    'confidence': confidence,
                    'recognized': user is not None
                }
                
                results.append(result)
        
        except Exception as e:
            self.logger.error(f"Erro ao processar frame: {e}")
        
        return results
    
    def reload_faces(self):
        """Recarrega faces conhecidas (útil após adicionar novos usuários)"""
        self.load_known_faces()