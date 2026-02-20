import json
import os
from datetime import datetime
from pathlib import Path
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend

from app.core.config import settings
from app.utils.logger import logger
from app.utils.file import get_resolved_path, ensure_parent_exists


def _get_emergency_path() -> Path:
    """
    Calculate the filesystem path for the emergency status file and 
    ensure its parent directory exists.

    :return: A Path object pointing to the emergency configuration file.
    :rtype: Path
    """
    path = Path(settings.TEMP_DIR) / settings.EMERGENCY_FILE_NAME
    ensure_parent_exists(path)
    return path


def _derive_key(password: str, salt: bytes) -> bytes:
    """
    Derive a 256-bit cryptographic key from a password using PBKDF2HMAC.

    :param password: The plain text passphrase used for key derivation.
    :type password: str
    :param salt: A random salt value to secure the derivation process.
    :type salt: bytes
    :return: A derived 32-byte (256-bit) key.
    :rtype: bytes
    """
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
        backend=default_backend()
    )
    return kdf.derive(password.encode())


def update_emergency_heartbeat() -> None:
    """
    Encrypt and update the last activity timestamp in the emergency file.

    :return: None
    :rtype: None
    """
    try:
        path = _get_emergency_path()
        data = {
            "last_activity": datetime.now().isoformat(),
            "status": "active"
        }
        json_data = json.dumps(data).encode('utf-8')

        salt = os.urandom(16)
        iv = os.urandom(12)
        key = _derive_key(settings.EMERGENCY_PASSPHRASE, salt)

        encryptor = Cipher(
            algorithms.AES(key),
            modes.GCM(iv),
            backend=default_backend()
        ).encryptor()
        
        ciphertext = encryptor.update(json_data) + encryptor.finalize()

        encrypted_payload = {
            "salt": salt.hex(),
            "iv": iv.hex(),
            "tag": encryptor.tag.hex(),
            "ciphertext": ciphertext.hex()
        }

        with open(path, "w", encoding="utf-8") as f:
            json.dump(encrypted_payload, f, indent=4)
            
        logger.debug("Emergency Heartbeat: Encrypted timestamp updated.")
    except Exception as e:
        logger.error(f"Failed to update emergency heartbeat: {e}")


def is_emergency_triggered() -> bool:
    """
    Decrypt the emergency file and check if the inactivity threshold is exceeded.

    :return: True if the inactivity duration meets or exceeds the threshold; 
             False otherwise.
    :rtype: bool
    """
    path = _get_emergency_path()
    if not path.exists():
        return False
    
    try:
        with open(path, "r", encoding="utf-8") as f:
            payload = json.load(f)

        salt = bytes.fromhex(payload["salt"])
        iv = bytes.fromhex(payload["iv"])
        tag = bytes.fromhex(payload["tag"])
        ciphertext = bytes.fromhex(payload["ciphertext"])

        key = _derive_key(settings.EMERGENCY_PASSPHRASE, salt)
        decryptor = Cipher(
            algorithms.AES(key),
            modes.GCM(iv, tag),
            backend=default_backend()
        ).decryptor()
        
        decrypted_data = decryptor.update(ciphertext) + decryptor.finalize()
        data = json.loads(decrypted_data.decode('utf-8'))
        
        last_act = datetime.fromisoformat(data["last_activity"])
        diff = datetime.now() - last_act
        
        return diff.days >= int(settings.EMERGENCY_DAYS_THRESHOLD)
    
    except Exception as e:
        logger.error(f"Error checking emergency trigger: {e}")
        return False