import cv2
from models.aluno import listar_alunos
from services.face_service import carregar_faces, reconhecer_face

def iniciar_reconhecimento():
    alunos = listar_alunos()
    encodings_db, nomes_db = carregar_faces(alunos)

    cap = cv2.VideoCapture(0)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        nome, autorizado = reconhecer_face(frame, encodings_db, nomes_db)

        texto = f"{nome} - {'Aprovado' if autorizado else 'Negado'}"
        cor = (0, 255, 0) if autorizado else (0, 0, 255)
        
        cv2.putText(frame, texto, (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, cor, 2)
        cv2.imshow("Reconhecimento Facial", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
