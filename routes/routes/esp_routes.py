import requests
import time
import uuid
from config import ESP_IP

def send_authorization(user_id):
    token = str(uuid.uuid4())[:8]
    expires_at = int(time.time() * 1000) + 20000
    payload = {"userId": user_id, "token": token, "expiresAt": expires_at}
    try:
        res = requests.post(f"http://{ESP_IP}/authorize", json=payload)
        if res.ok:
            return True, "Autorização enviada para ESP8266"
        return False, f"Erro ESP: {res.text}"
    except Exception as e:
        return False, f"Erro de rede: {e}"
