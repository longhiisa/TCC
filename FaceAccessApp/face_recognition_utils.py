import cv2
import face_recognition
import numpy as np
import json
from database import get_connection
from config import THRESHOLD

def capture_face():
    cap = cv2.VideoCapture(0)
    ret, frame = cap.read()
    cap.release()
    if not ret:
        return None, None
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    boxes = face_recognition.face_locations(rgb_frame)
    if len(boxes) != 1:
        return None, None
    encoding = face_recognition.face_encodings(rgb_frame, boxes)[0]
    return frame, encoding

def register_user(username):
    _, encoding = capture_face()
    if encoding is None:
        return False, "Erro: nenhum rosto detectado ou mais de um"
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO users (username, encoding) VALUES (%s, %s)",
                       (username, json.dumps(encoding.tolist())))
        conn.commit()
    except Exception as e:
        return False, f"Erro ao registrar: {e}"
    finally:
        conn.close()
    return True, "Usuário registrado com sucesso"

def authenticate_user():
    _, encoding = capture_face()
    if encoding is None:
        return None, "Erro: nenhum rosto detectado ou mais de um"
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT username, encoding FROM users")
    users = cursor.fetchall()
    conn.close()
    for username, enc_str in users:
        known_encoding = np.array(json.loads(enc_str))
        distance = face_recognition.face_distance([known_encoding], encoding)[0]
        if distance < THRESHOLD:
            return username, "Rosto reconhecido"
    return None, "Rosto não reconhecido"
