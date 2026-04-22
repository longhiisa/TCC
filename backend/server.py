from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import os

app = FastAPI()

# Libera o Next.js para acessar o Python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Aluno(BaseModel):
    nome: str
    ra: str
    image: str

@app.post("/cadastrar")
async def cadastrar(aluno: Aluno):
    # Cria a pasta para o DeepFace se não existir
    path = "./db_faces"
    if not os.path.exists(path): os.makedirs(path)

    # Decodifica a imagem da Logitech
    try:
        format, imgstr = aluno.image.split(';base64,') 
        data = base64.b64decode(imgstr)
        
        # Salva com o nome/RA do aluno para o DeepFace reconhecer depois
        filename = f"{path}/{aluno.nome}_{aluno.ra}.jpg"
        with open(filename, "wb") as f:
            f.write(data)
            
        return {"message": "Foto salva para reconhecimento facial!"}
    except Exception as e:
        return {"error": str(e)}, 400

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)