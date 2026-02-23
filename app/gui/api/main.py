import webview
from typing import Optional, List, Dict
from pathlib import Path

from app.core.config import settings
from app.controllers.kdbx.manager import (
    generate_keyfile, create_new_vault, open_vault as open_vault_controller
)
from app.utils.logger import logger
from app.controllers.history import (
    get_history as get_history_controller, truncate_paths_middle, 
    clear_history as clear_history_controller, update_history,
    remove_from_history
)


class API:
    """
    """


    def __init__(self):
        self._window: Optional[webview.Window] = None


    def set_window(self, window: webview.Window):
        self._window = window

        
    def get_app_version(self) -> str:
        return settings.VERSION
    
    
    def get_app_name(self) -> str:
        return settings.PROJECT_NAME
    
    def get_history(self) -> List[Dict[str, str]]:
        return truncate_paths_middle(get_history_controller())

    
    def clear_history(self) -> bool:
        return clear_history_controller()
    

    def save_file_dialog(self, default_filename: str, file_type: str) -> Optional[str]:
        if not self._window:
            return None
            
        result = self._window.create_file_dialog(
            webview.FileDialog.SAVE,
            save_filename=default_filename,
            file_types=(file_type, 'All files (*.*)')
        )
        if result and len(result) > 0:
            return result[0]
        return None


    def create_vault(self, path: str, password: str, keyfile: Optional[str] = None) -> bool:
        return create_new_vault(path, password, keyfile)


    def generate_keyfile(self, path: str) -> Optional[str]:
        return generate_keyfile(path)


    def get_startup_route(self) -> str:
        if settings.FILE_PATH:
            return "/login"
        return "/welcome"


    def set_file_path(self, path: str) -> bool:
        if not path:
            logger.error("Attempted to set an empty FILE_PATH.")
            return False

        if not Path(path).exists():
            logger.warning(f"File not found: '{path}'. Removing from history.")
            remove_from_history(path)
            return False

        try:
            settings.FILE_PATH = path
            update_history(path)
        except Exception as e:
            logger.error(f"Failed to update FILE_PATH setting: {e}")
            settings.FILE_PATH = None
            return False
        
        logger.info(f"Application FILE_PATH updated to: {path}")
        return True

    
    def select_file(self, file_types: tuple = ('All files (*.*)',)) -> Optional[str]:
        if not self._window:
            return None

        if isinstance(file_types, list):
            file_types = tuple(file_types)
            
        result = self._window.create_file_dialog(
            webview.FileDialog.OPEN,
            allow_multiple=False,
            file_types=file_types
        )
        
        if result and len(result) > 0:
            return result[0]
        return None

    
    def open_vault(self, password: str, keyfile: Optional[str] = None) -> bool:
        if not settings.FILE_PATH:
            logger.error("Attempted to unlock vault, but no FILE_PATH is set.")
            return False
            
        try:
            success = open_vault_controller(path=settings.FILE_PATH, password=password, keyfile=keyfile) 
            if success:
                logger.info("Vault successfully unlocked via GUI.")
                return True
            else:
                logger.warning("Failed to unlock vault (invalid credentials).")
                return False
        except Exception as e:
            logger.error(f"Error while opening vault: {e}")
            return False