from kivy.app import App
from kivy.uix.screenmanager import ScreenManager, Screen
from kivy.lang import Builder
from database import init_db
from routes.user_routes import route_register_user, route_authenticate_user
from routes.esp_routes import send_authorization

# Inicializar banco
init_db()

# Telas
class LoginScreen(Screen):
    def authenticate(self):
        result = route_authenticate_user()
        if result["username"]:
            success, msg = send_authorization(result["username"])
            self.ids.label.text = f"{result['message']}\n{msg}"
        else:
            self.ids.label.text = result["message"]

class RegisterScreen(Screen):
    def register(self):
        username = self.ids.username_input.text
        result = route_register_user(username)
        self.ids.label.text = result["message"]

class MainScreen(Screen):
    pass

# Gerenciador de telas
sm = ScreenManager()
sm.add_widget(LoginScreen(name="login"))
sm.add_widget(RegisterScreen(name="register"))
sm.add_widget(MainScreen(name="main"))

class FaceAccessApp(App):
    def build(self):
        return sm

if __name__ == "__main__":
    FaceAccessApp().run()
