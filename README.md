# TCC

# Documentação do Sistema de Reconhecimento Facial com Python e MySQL
 1. Objetivo do Sistema

O sistema tem como finalidade realizar o controle de entrada de alunos através de reconhecimento facial. 
As fotos dos alunos ficam armazenadas no banco de dados MySQL e, ao utilizar a câmera, o sistema compara a face capturada com as fotos cadastradas.

Entrada Aprovada → aluno encontrado no banco e reconhecido.

Entrada Negada → pessoa não cadastrada ou não reconhecida.

2. Tecnologias Utilizadas

Python 3.8+ → Linguagem principal.

MySQL → Banco de dados para armazenar informações e fotos dos alunos.

OpenCV (cv2) → Captura de vídeo da câmera e manipulação de imagens.

face_recognition → Biblioteca para detecção e reconhecimento facial.

Flask → Estrutura para rotas e organização (caso evolua para API).