from dataclasses import dataclass
from typing import Optional
import json
import numpy as np

@dataclass
class User:
    """Modelo de usuário do sistema"""
    
    id: Optional[int] = None
    name: str = ""
    email: str = ""
    type: str = ""  # aluno ou professor
    face_encoding: Optional[np.ndarray] = None
    photo_path: Optional[str] = None
    active: bool = True
    
    def face_encoding_to_json(self) -> str:
        if self.face_encoding is not None:
            return json.dumps(self.face_encoding.tolist())
        return ""
    
    def face_encoding_from_json(self, json_str: str):
        if json_str:
            encoding_list = json.loads(json_str)
            self.face_encoding = np.array(encoding_list)
    
    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'type': self.type,
            'face_encoding': self.face_encoding_to_json(),
            'photo_path': self.photo_path,
            'active': self.active
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> 'User':
        user = cls(
            id=data.get('id'),
            name=data.get('name', ''),
            email=data.get('email', ''),
            type=data.get('type', ''),
            photo_path=data.get('photo_path'),
            active=data.get('active', True)
        )
        encoding_json = data.get('face_encoding')
        if encoding_json:
            user.face_encoding_from_json(encoding_json)
        return user
