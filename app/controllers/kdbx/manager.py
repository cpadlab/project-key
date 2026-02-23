import secrets
import base64
import logging
from pathlib import Path
from typing import Optional
from pykeepass import PyKeePass, create_database
from pykeepass.exceptions import CredentialsError

from app.core.config import settings
from app.utils.file import validate_and_prepare_path, get_resolved_path
from app.controllers.history import update_history
from app.controllers.kdbx.session import VaultSession


logger = logging.getLogger(settings.PROJECT_NAME)
_session = VaultSession()


def _register_active_vault(path: str, kp_instance: PyKeePass) -> None:
    """
    Update the global application settings and the internal session state 
    with the newly activated vault data.

    :param path: The absolute filesystem path to the active .kdbx file.
    :type path: str
    :param kp_instance: The initialized PyKeePass instance for the vault.
    :type kp_instance: PyKeePass
    :return: None
    :rtype: None
    """
    settings.FILE_PATH = path
    _session.active_path = path
    _session.transformed_key = kp_instance.transformed_key
    _session.vault = kp_instance
    update_history(path)
    logger.debug(f"Session and global settings updated for vault: {path}")


def create_new_vault(path: str, password: str, keyfile: Optional[str] = None) -> bool:
    """
    Create a new KDBX database file (vault) and set it as the active session.

    :param path: Raw filesystem path where the vault is intended to be saved.
    :type path: str
    :param password: Master password for the new database.
    :type password: str
    :param keyfile: (Optional) Path to an existing keyfile to secure the vault.
    :type keyfile: Optional[str]
    :return: True if created and registered successfully, False otherwise.
    :rtype: bool
    """
    output_path = validate_and_prepare_path(path, '.kdbx')
    if not output_path:
        return False

    try:
        logger.info(f"Initializing new vault creation at: {output_path}")
        kp = create_database(filename=str(output_path), password=password, keyfile=keyfile)
        
        kp.add_group(kp.root_group, settings.PERSONAL_GROUP_NAME)

        kp.save()
        _register_active_vault(str(output_path), kp)

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


def open_vault(path: str, password: Optional[str] = None, keyfile: Optional[str] = None) -> bool:
    """
    Open an existing KDBX vault and initialize the active session.

    :param path: Path to the .kdbx file.
    :type path: str
    :param password: (Optional) Master password for the database.
    :type password: Optional[str]
    :param keyfile: (Optional) Path to the required keyfile.
    :type keyfile: Optional[str]
    :return: True if opened and session initialized successfully, False otherwise.
    :rtype: bool
    """
    resolved_path = get_resolved_path(path, suffix='.kdbx')
    
    if not resolved_path.exists():
        logger.error(f"Vault file not found at: {resolved_path}")
        return False

    try:
        logger.info(f"Opening vault: {resolved_path.name}")
        kp = PyKeePass(filename=str(resolved_path), password=password, keyfile=keyfile)

        _register_active_vault(str(resolved_path), kp)
        return True

    except CredentialsError:
        logger.error("Invalid credentials (password or keyfile).")
    except Exception as e:
        logger.error(f"Unexpected error opening vault: {e}")
    
    return False


def get_active_vault() -> Optional[PyKeePass]:
    """
    Retrieve the active PyKeePass instance or re-open it using the transformed_key.

    :return: The active PyKeePass instance if available, None otherwise.
    :rtype: Optional[PyKeePass]
    """
    if _session.vault:
        return _session.vault

    if _session.active_path and _session.transformed_key:
        try:
            logger.debug("Re-opening vault using transformed_key...")
            _session.vault = PyKeePass(
                filename=_session.active_path, 
                transformed_key=_session.transformed_key
            )
            return _session.vault
        except Exception as e:
            logger.error(f"Failed to restore session: {e}")
            _session.clear()
    
    return None


def close_current_vault() -> None:
    """
    Terminate the current vault session and clear all sensitive data from memory.

    :return: None
    :rtype: None
    """
    _session.clear()
    settings.FILE_PATH = None
    logger.info("Current vault session has been closed and purged.")