import cv2
import os
from services.database_service import DatabaseService
from services.face_recognition_service import FaceRecognitionService
from models.user_model import User
from utils.logger import Logger

class UserRegistration:
    """Sistema de registro de usuários usando arquivos de foto"""

    def __init__(self):
        self.db_service = DatabaseService()
        self.face_recognition = FaceRecognitionService()
        self.logger = Logger()
        self.photos_dir = "user_photos"

        # Cria diretório para fotos se não existir
        if not os.path.exists(self.photos_dir):
            os.makedirs(self.photos_dir)

    def get_user_info(self) -> User:
        """Coleta informações do usuário"""
        print("\n" + "="*50)
        print("📝 CADASTRO DE NOVO USUÁRIO")
        print("="*50)

        user = User()

        # Nome
        while not user.name:
            user.name = input("Nome completo: ").strip()
            if not user.name:
                print("❌ Nome é obrigatório!")

        # Email
        while not user.email:
            user.email = input("Email: ").strip()
            if not user.email:
                print("❌ Email é obrigatório!")

        # Tipo
        while user.type not in ['aluno', 'professor']:
            user.type = input("Tipo (aluno/professor): ").strip().lower()
            if user.type not in ['aluno', 'professor']:
                print("❌ Tipo deve ser 'aluno' ou 'professor'!")

        return user

    def register_user_from_file(self, user: User, photo_filename: str):
        """Registra usuário usando uma foto existente no diretório user_photos/"""
        photo_path = os.path.join(self.photos_dir, photo_filename)

        if not os.path.exists(photo_path):
            print(f"❌ Foto não encontrada: {photo_path}")
            return False

        print(f"📷 Usando foto: {photo_path}")
        image = cv2.imread(photo_path)

        # Processa face encoding
        print("🔄 Processando reconhecimento facial...")
        face_encoding = self.face_recognition.encode_face(image)

        if face_encoding is None:
            print("❌ Não foi possível detectar face na foto!")
            return False

        # Salva no banco
        user.face_encoding = face_encoding
        user.photo_path = photo_path

        if self.db_service.add_user(user):
            print(f"✅ Usuário {user.name} cadastrado com sucesso!")
            print(f"📊 ID: {user.id}")
            print(f"📧 Email: {user.email}")
            print(f"👤 Tipo: {user.type}")
            return True
        else:
            print("❌ Erro ao salvar usuário no banco de dados")
            return False

    def list_users(self):
        """Lista usuários cadastrados"""
        users = self.db_service.get_all_users()

        if not users:
            print("📭 Nenhum usuário cadastrado")
            return

        print(f"\n👥 USUÁRIOS CADASTRADOS ({len(users)})")
        print("="*60)

        for user in users:
            status = "🟢 Ativo" if user.active else "🔴 Inativo"
            print(f"ID: {user.id:3d} | {user.name:20s} | {user.type:9s} | {status}")

        print("="*60)


def main():
    """Função principal do script"""
    registration = UserRegistration()

    while True:
        print("\n" + "="*50)
        print("🎯 SISTEMA DE REGISTRO DE USUÁRIOS (via arquivo de foto)")
        print("="*50)
        print("1. 👤 Registrar novo usuário")
        print("2. 📋 Listar usuários cadastrados")
        print("3. 🚪 Sair")
        print("="*50)

        choice = input("Escolha uma opção (1-3): ").strip()

        if choice == '1':
            try:
                user = registration.get_user_info()
                # Aqui você escolhe qual arquivo usar
                filename = input("Nome do arquivo da foto (ex: Aluno.jpg): ").strip()
                registration.register_user_from_file(user, filename)
            except KeyboardInterrupt:
                print("\n❌ Registro cancelado pelo usuário")
            except Exception as e:
                print(f"❌ Erro durante registro: {e}")

        elif choice == '2':
            registration.list_users()

        elif choice == '3':
            print("👋 Até logo!")
            break

        else:
            print("❌ Opção inválida!")


if __name__ == "__main__":
    main()
