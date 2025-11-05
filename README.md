# TCC

# Documentação do Sistema de Reconhecimento Facial com Python e MySQL
 1. Objetivo do Sistema

O sistema tem como finalidade realizar o controle de entrada de alunos e prfessores através de reconhecimento facial. 
As fotos dos alunos/professores ficam armazenadas no banco de dados MySQL e, ao utilizar a câmera, o sistema compara a face capturada com as fotos cadastradas.

Entrada Aprovada → aluno/professor encontrado no banco e reconhecido.

Entrada Negada → pessoa não cadastrada ou não reconhecida.

2. Tecnologias Utilizadas

Python 3.8+ → Linguagem principal.

MySQL → Banco de dados para armazenar informações e fotos dos alunos.

OpenCV (cv2) → Captura de vídeo da câmera e manipulação de imagens.

face_recognition → Biblioteca para detecção e reconhecimento facial.

Flask → Estrutura para rotas e organização (caso evolua para API).

3. Estrutura do Meu Código

TCC/
│── .env                         # Variáveis de ambiente (MySQL)
│── requirements.txt              # Dependências do projeto
│── setup_database.py             # Criação das tabelas no MySQL
│── add_user.py                   # Captura e cadastro de novos usuários
│── main.py                       # Sistema principal de reconhecimento
│
├── facial_recognition_system/
│   ├── config/
│   │   ├── __pycache__/          # Arquivos compilados do Python
│   │   │   └── database.cpython-313.pyc
│   │   └── database.py           # Configuração de banco de dados
│   │
│   ├── models/
│   │   └── user_model.py         # Classe User
│   │
│   ├── services/
│   │   ├── camera_service.py     # Controle da câmera (OpenCV)
│   │   ├── database_service.py   # Comunicação com MySQL
│   │   └── face_recognition_service.py # Processamento facial
│   │
│   ├── user_photos/              # Pasta para armazenar fotos originais
│   │   ├── Aluno.jpg
│   │   └── Professor.jpg
│   │
│   └── utils/
│       ├── face_detector.py      # Detector de faces (usando dlib/face_recognition)
│       └── logger.py             # Logs e debug
│
├── venv/                         # Ambiente virtual do projeto
│   ├── Include/
│   ├── Lib/
│   └── Scripts/
│
├── pymol-open-source-wheels-main/ # (arquivos baixados, parece temporário)
│   ├── PyMOL.ico
│   ├── README.md
│   └── setup.py
│
├── cmake-4.1.1-windows-x86_64.msi # Instalador CMake
├── cmake-4.1.1.zip
├── Postman-win64-Setup.exe        # Instalador Postman
├── pymol-open-source-wheels-main.zip
├── README.md
└── vs_BuildTools.exe              # Instalador Visual Studio Build Tools

4. Qual a função das Dependencias do Reconhecimento Facial

1) face-recognition==1.3.0
.É a biblioteca principal para reconhecimento facial.

.Ela usa o dlib por baixo dos panos.

.Converte rostos em vetores numéricos (embeddings) com 128 valores.

.Quando uma nova pessoa aparece na câmera, o sistema compara o vetor dela com os vetores salvos no banco.

2) dlib==19.24.2

.É o motor matemático e de visão computacional.

.Responsável por: detectar rostos (localização no frame);

calcular landmarks (olhos, nariz, boca);

gerar embeddings faciais (vetores de 128 dimensões);

fazer o matching (comparação de vetores).

3) opencv-python==4.8.1.78

.Usado para capturar vídeo da webcam e exibir na tela.

.Também permite desenhar caixas, textos, e manipular os frames em tempo real.

4) numpy==1.24.3

.As imagens são matrizes numéricas (pixels = números de 0 a 255).

.O NumPy é a base para manipular esses arrays.

.Também é usado para cálculos rápidos entre vetores (como distâncias entre embeddings).

5) Pillow==10.0.0

Serve para abrir, converter e salvar imagens em formatos comuns (.jpg, .png, etc).

É usada quando você quer armazenar as fotos capturadas pela câmera no disco.

6) mysql-connector-python==8.1.0

Faz a conexão com o banco MySQL para salvar:

dados pessoais (nome, tipo, matrícula);

caminhos das fotos;

os vetores faciais (como BLOBs ou base64).

7) python-dotenv==1.0.0

.Permite guardar senhas e configurações fora do código, em um arquivo .env.

.Evita riscos de segurança.

8) CMake==3.27.0

.É uma ferramenta de construção e compilação.

.Necessária para compilar o dlib (especialmente no Windows).

.Só é usada durante a instalação do dlib, não no funcionamento do sistema.

5. O que eu fiz desde o inicio do Projeto até hoje 05/11/1025

Comecei estudando um pouco o Python para entender como funcionava antes de começar a programar.

Após o estudo eu comecei a instalar o python pois o computador não tinha intalado depois que intalei fui começar a criar só vendo como é e como funcionava ai eu instalei as extensões necessarias(python) no vscode fui criando quando cometi um erro de branch aonde eu estava trabalhando e salvando em outra branch então eu comecei "de novo" em outra branch só que agora é definitivo.

então fui criando e criando quando fui testar os requirements.txt dando um pip install foi quando deu erro aonde eu tive muito problema para consertar ai tive que usar o chatgpt para descobrir o erro foi quando o chat revelou que eu teria que instalar o cmake e o VS Build Tools foi ai que fui obrigado a pedir a ajuda do professor pois tava tudo bloqueado pela rede assim impedindo o meu avanço e mesmo com ajuda do prefessor só conseguimos instalar o cmake até tentamos achar formas alternativas para instalar o VS Build Tools mas infelizmente não teve jeito agora eu teria que usar o meu notebook pessoal aonde teria que instalar quase tudo de novo.

com quase tudo instalado fatalva só da minha branch só que o commit não estava funcionando então eu pedi ajuda ao professor que falou que não era nada e que não sabia tive que pedir ao outro professor que conseguiu arumar eu só perdir a minha documentação.

6. O que falta para eu terminar

Agora só falta eu ir no meu notebook e testar se está funcionando
