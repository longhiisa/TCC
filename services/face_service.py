import cv2
import face_recognition
import numpy as np
import numpy as np

def carregar_faces(alunos):
    encodings = []
    nomes = []

    for aluno in alunos:
        foto_bytes = aluno["foto"]
        np_img = np.frombuffer(foto_bytes, np.uint8)
        img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

        face_enc = face_recognition.face_encodings(img)
        if face_enc:
            encodings.append(face_enc[0])
            nomes.append(aluno["nome"])
    
    return encodings, nomes

def reconhecer_face(frame, encodings_db, nomes_db):
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    face_locations = face_recognition.face_locations(rgb_frame)
    face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

    for face_encoding in face_encodings:
        matches = face_recognition.compare_faces(encodings_db, face_encoding)
        face_distances = face_recognition.face_distance(encodings_db, face_encoding)
        
        if True in matches:
            match_index = np.argmin(face_distances)
            return nomes_db[match_index], True
    
    return "Desconhecido", False
