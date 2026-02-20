import logging
from typing import Optional
from pykeepass import PyKeePass

from app.core.config import settings


logger = logging.getLogger(settings.PROJECT_NAME)


class VaultSession:
    """
    Singleton-like session manager for the active KDBX database.
    """


    def __init__(self):
        """
        Initialize an empty vault session.

        :ivar active_path: The absolute filesystem path to the active .kdbx file.
        :vartype active_path: Optional[str]
        :ivar transformed_key: The precomputed AES/Argon2 transformed key bytes.
        :vartype transformed_key: Optional[bytes]
        :ivar vault: The active PyKeePass database controller instance.
        :vartype vault: Optional[PyKeePass]
        """
        self.active_path: Optional[str] = None
        self.transformed_key: Optional[bytes] = None
        self.vault: Optional[PyKeePass] = None


    def clear(self) -> None:
        """
        Reset the current session state and purge sensitive data from memory.

        :return: None
        :rtype: None
        """
        self.active_path = None
        self.transformed_key = None
        self.vault = None
        logger.debug("Vault session cleared.")