from face_recognition_utils import register_user, authenticate_user

def route_register_user(username):
    success, message = register_user(username)
    return {"success": success, "message": message}

def route_authenticate_user():
    username, message = authenticate_user()
    return {"username": username, "message": message}
