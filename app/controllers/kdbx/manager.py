from pathlib import Path
from typing import Optional
from pykeepass import PyKeePass

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