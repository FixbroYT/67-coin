from urllib.parse import parse_qsl
import hmac
import hashlib
import json
from services.core.exceptions import TelegramValidationException


def verify_init_data(init_data: str, bot_token: str) -> int:
    init_data_dict = dict(parse_qsl(init_data))
    client_hash = init_data_dict.get("hash")

    if not client_hash:
        raise TelegramValidationException("Missing client hash.")

    init_data_dict.pop("hash")

    sorted_init_data = sorted(init_data_dict.items())
    data_check_string = "\n".join(f"{k}={v}" for k, v in sorted_init_data)

    secret_key = hmac.new(
        key=b"WebAppData",
        msg=bot_token.encode(),
        digestmod=hashlib.sha256
    ).digest()

    calculated_hash = hmac.new(
        key=secret_key,
        msg=data_check_string.encode(),
        digestmod=hashlib.sha256
    ).hexdigest()
    
    if client_hash != calculated_hash:
        raise TelegramValidationException("Invalid telegram init data signature.")
    
    user_data = json.loads(init_data_dict.get("user"))
    return int(user_data.get("id"))