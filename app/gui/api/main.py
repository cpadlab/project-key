import webview
from typing import Optional, List, Dict
from pathlib import Path
import logging

from app.controllers.export import export_vault_data
from app.utils.file import open_folder_in_explorer
from app.core.config import settings, DEFAULT_INI_FILE
from app.utils.logger import logger
from app.controllers.kdbx.models import GroupModel, EntryModel
from app.controllers.imports import (
    execute_final_import, parse_csv_to_models, get_csv_columns
)
from app.controllers.kdbx.operations import (
    create_group as create_group_controller,
    list_groups as list_groups_controller,
    delete_group as delete_group_controller,
    add_entry as add_entry_controller,
    list_entries_by_group as list_entries_by_group_controllers,
    find_entries as find_entries_controller
)
from app.controllers.kdbx.manager import (
    generate_keyfile, create_new_vault, open_vault as open_vault_controller,
    close_current_vault, get_active_vault
)
from app.utils.logger import logger
from app.controllers.history import (
    get_history as get_history_controller, truncate_paths_middle, 
    clear_history as clear_history_controller, update_history,
    remove_from_history, _get_history_path
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


    def is_session_active(self) -> bool:
        return get_active_vault() is not None


    def get_security_settings(self) -> dict:
        return {
            "pwned_audit_enabled": settings.PWNED_AUDIT_ENABLED,
            "password_audit_interval": settings.PASSWORD_AUDIT_INTERVAL,
            "clipboard_clear_interval": settings.CLIPBOARD_CLEAR_INTERVAL
        }


    def set_pwned_audit_enabled(self, enabled: bool) -> bool:
        try:
            settings.PWNED_AUDIT_ENABLED = bool(enabled)
            logger.info(f"Pwned audit enabled updated to: {settings.PWNED_AUDIT_ENABLED}")
            return settings.save_settings()
        except Exception as e:
            logger.error(f"Error saving pwned_audit_enabled: {e}")
            return False


    def set_password_audit_interval(self, interval: int) -> bool:
        try:
            parsed_interval = max(10, int(interval))
            settings.PASSWORD_AUDIT_INTERVAL = parsed_interval
            logger.info(f"Password audit interval updated to: {parsed_interval}")
            return settings.save_settings()
        except Exception as e:
            logger.error(f"Error saving password_audit_interval: {e}")
            return False


    def set_clipboard_clear_interval(self, interval: int) -> bool:
        try:
            parsed_interval = max(5, int(interval))
            settings.CLIPBOARD_CLEAR_INTERVAL = parsed_interval
            logger.info(f"Clipboard clear interval updated to: {parsed_interval}")
            return settings.save_settings()
        except Exception as e:
            logger.error(f"Error saving clipboard_clear_interval: {e}")
            return False


    def get_maintenance_settings(self) -> dict:
        return {
            "recycle_bin_retention_days": settings.RECYCLE_BIN_RETENTION_DAYS,
            "backup_max_count": settings.BACKUP_MAX_COUNT,
            "other_services_interval": settings.OTHER_SERVICES_INTERVAL
        }


    def set_recycle_bin_retention_days(self, days: int) -> bool:
        try:
            parsed_days = max(1, int(days))
            settings.RECYCLE_BIN_RETENTION_DAYS = parsed_days
            logger.info(f"Recycle bin retention days updated to: {parsed_days}")
            return settings.save_settings()
        except Exception as e:
            logger.error(f"Error saving recycle_bin_retention_days: {e}")
            return False


    def set_backup_max_count(self, count: int) -> bool:
        try:
            parsed_count = max(1, min(20, int(count)))
            settings.BACKUP_MAX_COUNT = parsed_count
            logger.info(f"Backup max count updated to: {parsed_count}")
            return settings.save_settings()
        except Exception as e:
            logger.error(f"Error saving backup_max_count: {e}")
            return False


    def set_other_services_interval(self, interval: int) -> bool:
        try:
            parsed_interval = max(30, int(interval))
            settings.OTHER_SERVICES_INTERVAL = parsed_interval
            logger.info(f"Other services interval updated to: {parsed_interval}")
            return settings.save_settings()
        except Exception as e:
            logger.error(f"Error saving other_services_interval: {e}")
            return False


    def get_log_level(self) -> str:
        return settings.LOG_LEVEL.lower()


    def set_log_level(self, level: str) -> bool:
        valid_levels = ["debug", "info", "warning", "error", "critical"]
        level = level.lower()
        
        if level not in valid_levels:
            logger.error(f"Attempt to set invalid log level: {level}")
            return False
            
        try:
            settings.LOG_LEVEL = level
            logging.getLogger(settings.PROJECT_NAME).setLevel(level.upper())
            logger.info(f"Log level updated to: {level}")
            return settings.save_settings()
        except Exception as e:
            logger.error(f"Error saving log level: {e}")
            return False


    def open_log_dir(self) -> bool:
        return open_folder_in_explorer(settings.LOG_DIR)


    def open_backup_dir(self) -> bool:
        return open_folder_in_explorer(settings.BACKUP_DIR)


    def open_history_dir(self) -> bool:
        return open_folder_in_explorer(_get_history_path())


    def open_config_dir(self) -> bool:
        path = settings.ACTIVE_CONFIG_PATH or str(DEFAULT_INI_FILE)
        return open_folder_in_explorer(path)


    def add_entry(self, entry_data: dict) -> bool:        
        try:
            entry_model = EntryModel(**entry_data)
            logger.info(f"Adding new entry: {entry_model.title}")
            return add_entry_controller(entry_model)
        except Exception as e:
            logger.error(f"Backend error adding entry: {e}")
            return False

    
    def list_entries_by_group(self, group_name: str) -> List[Dict]:
        try:
            entries = list_entries_by_group_controllers(group_name)
            
            cleaned_entries = []
            for e in entries:
                entry_dict = e.model_dump(mode='json')
                entry_dict['password'] = bool(entry_dict.get('password'))
                entry_dict['totp_seed'] = bool(entry_dict.get('totp_seed'))
                cleaned_entries.append(entry_dict)
                
            return cleaned_entries
        except Exception as e:
            logger.error(f"Error listing entries for group {group_name}: {e}")
            return []


    def export_data(self, format: str, group_name: Optional[str] = None) -> bool:        
        ext = format.lower()
        scope_name = group_name if group_name else "full_vault"
        default_filename = f"export_{scope_name.lower()}.{ext}"
        
        file_path = self.save_file_dialog(
            default_filename=default_filename,
            file_type=f"{ext.upper()} Files (*.{ext})"
        )
        
        if not file_path:
            logger.info("Export cancelled by the user (no route selected).")
            return False
            
        try:
            return export_vault_data(file_path, format=ext, group_name=group_name)
        except Exception as e:
            logger.error(f"Fatal error during export to {file_path}: {e}")
            return False
        

    def select_import_file(self) -> Optional[str]:
        return self.select_file(file_types=('CSV files (*.csv)', 'All files (*.*)'))


    def preview_csv_import(self, file_path: str, preset: Optional[str] = None, mapping: Optional[Dict] = None) -> List[Dict]:
        try:
            entries = parse_csv_to_models(
                file_path=file_path, 
                preset_name=preset, 
                manual_mapping=mapping
            )
            return [e.model_dump(mode='json') for e in entries]
        except Exception as e:
            logger.error(f"Error in preview_csv_import: {e}")
            return []


    def run_import(self, entries_data: List[Dict], target_group: str) -> Dict[str, int]:
        entries = [EntryModel(**data) for data in entries_data]
        return execute_final_import(entries, target_group)


    def get_csv_columns(self, file_path: str) -> List[str]:
        try:
            logger.info(f"Fetching CSV columns for: {file_path}")
            return get_csv_columns(file_path)
        except Exception as e:
            logger.error(f"Error fetching CSV columns via API: {e}")
            return []


    def search_entries(self, query: str) -> List[Dict]:
        try:
            entries = find_entries_controller(query=query)
            return [e.model_dump(mode='json') for e in entries]
        except Exception as e:
            logger.error(f"Error searching entries: {e}")
            return []