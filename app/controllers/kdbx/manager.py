from pathlib import Path
from typing import Optional
from pykeepass import PyKeePass
import secrets
import base64

from app.core.config import settings
from app.utils.logger import logger
from app.utils.file import validate_and_prepare_path
from app.controllers.history import update_history


def _register_vault_in_settings(path: str) -> None:
    """
    Private helper to register the vault path in the global application 
    settings for the current session.

    :param path: The filesystem path to the vault.
    :type path: str
    :return: None
    :rtype: None
    """
    settings.FILE_PATH = path
    logger.debug(f"Global settings updated with vault path: {path}")


def create_new_vault(path: str, password: str, keyfile: Optional[str] = None) -> bool:
    """
    Create a new KDBX database file (vault), registers it in the history, 
    and sets it as the active database in settings.

    :param path: Raw path where the vault is intended to be saved.
    :type path: str
    :param password: Master password for the database.
    :type password: str
    :param keyfile: (Optional) Path to a key file (.key).
    :type keyfile: Optional[str]
    :return: True if the vault was created and registered successfully, False otherwise.
    :rtype: bool
    """
    output_path = validate_and_prepare_path(path, '.kdbx')
    
    if not output_path:
        return False

    try:
        logger.info(f"Initializing new vault creation at: {output_path}")
        kp = PyKeePass(filename=str(output_path), password=password, keyfile=keyfile)

        kp.save()

        update_history(str(output_path))
        _register_vault_in_settings(str(output_path))

        logger.info(f"Vault created and registered successfully: {output_path.name}")
        return True

    except Exception as e:
        logger.error(f"Failed to create KDBX vault: {e}")
        return False


def generate_keyfile(path: str) -> Optional[str]:
    """
    Generate a standard KeePass XML keyfile with 256 bits of entropy.

    :param path: Destination path for the .key file.
    :type path: str
    :return: The absolute path to the generated keyfile if successful, None otherwise.
    :rtype: Optional[str]
    """
    target_path = validate_and_prepare_path(path, '.key')
    if not target_path:
        return None

    try:
        key_data = secrets.token_bytes(32)
        base64_key = base64.b64encode(key_data).decode('utf-8')

        xml_content = (
            '<?xml version="1.0" encoding="utf-8"?>\n'
            '<KeyFile>\n'
            '    <Meta>\n'
            '        <Version>1.00</Version>\n'
            '    </Meta>\n'
            '    <Key>\n'
            '        <Data>' + base64_key + '</Data>\n'
            '    </Key>\n'
            '</KeyFile>'
        )

        with open(target_path, "w", encoding="utf-8") as f:
            f.write(xml_content)

        logger.info(f"Keyfile generated successfully at: {target_path}")
        return str(target_path)

    except Exception as e:
        logger.error(f"Failed to generate keyfile: {e}")
        return None