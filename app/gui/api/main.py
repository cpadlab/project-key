import webview
from typing import Optional, List, Dict
from pathlib import Path

from app.core.config import settings
from app.controllers.kdbx.models import GroupModel
from app.controllers.kdbx.operations import (
    create_group as create_group_controller,
    list_groups as list_groups_controller,
    delete_group as delete_group_controller
)
from app.controllers.kdbx.manager import (
    generate_keyfile, create_new_vault, open_vault as open_vault_controller,
    close_current_vault
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
        self._on_force_exit = None


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


    def create_group(self, name: str, icon_id: int = 48, color: Optional[str] = None) -> bool:
        try:
            success = create_group_controller(group_data=GroupModel(
                name=name, icon=icon_id, color=color
            ))

            if success:
                logger.info(f"Group '{name}' successfully created.")
                return True
            else:
                logger.warning(f"The group '{name}' could not be created.")
                return False
                
        except Exception as e:
            logger.error(f"Fatal error creating group: {e}")
            return False


    def list_groups(self) -> List[Dict]:
        try:
            groups = list_groups_controller()
            return [g.model_dump(mode='json') for g in groups]
        except Exception as e:
            logger.error(f"Error listing groups: {e}")
            return []


    def delete_group(self, name: str, force: bool = False, move_to: Optional[str] = None) -> bool:
        try:
            target_group = move_to if move_to and move_to.strip() else None
            success = delete_group_controller(group_name=name, force_delete_entries=force, move_entries_to=target_group)
            if success:
                logger.info(f"Group '{name}' deleted (Force: {force}, MoveTo: {target_group})")
            return success
        except Exception as e:
            logger.error(f"Error in API delete_group: {e}")
            return False


    def get_close_behavior(self) -> str:
        return settings.CLOSE_BEHAVIOR


    def set_close_behavior(self, behavior: str) -> bool:
        if behavior in ['ask', 'minimize', 'exit']:
            settings.CLOSE_BEHAVIOR = behavior
            logger.info(f"Closing preference updated to: {behavior}")
            success = settings.save_settings()
            if success:
                logger.info("Settings saved to disk successfully.")
            return success
        return False


    def minimize_window(self):
        if self._window:
            self._window.hide()


    def exit_application(self):
        logger.info("Frontend requested to close the application.")
        if self._on_force_exit:
            self._on_force_exit()
        elif self._window:
            self._window.destroy()


    def set_force_exit_callback(self, callback):
        self._on_force_exit = callback


    def close_session(self) -> bool:
        try:
            close_current_vault()
            logger.info("Session closed successfully via GUI request.")
            return True
        except Exception as e:
            logger.error(f"Error closing session via API: {e}")
            return False