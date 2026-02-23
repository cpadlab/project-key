import json
from pathlib import Path
from typing import List, Dict

from app.core.config import settings
from app.utils.logger import logger
from app.utils.file import get_resolved_path, ensure_parent_exists
from app.controllers.emergency import update_emergency_heartbeat


def _get_history_path() -> Path:
    """
    Calculate the full filesystem path to the history file and ensure 
    the parent directory exists.

    :return: A Path object pointing to the history JSON file.
    :rtype: Path
    """
    raw_path = Path(settings.TEMP_DIR) / settings.HISTORY_FILENAME
    resolved_path = get_resolved_path(str(raw_path))
    ensure_parent_exists(resolved_path)
    return resolved_path


def remove_from_history(file_path: str) -> bool:
    """
    Removes a specific file path from the history if it exists.

    :param file_path: The filesystem path to remove.
    :type file_path: str
    :return: True if the file was found and removed, False otherwise.
    :rtype: bool
    """
    if not file_path:
        return False

    history = get_history()
    if file_path in history:
        history.remove(file_path)
        try:
            with open(_get_history_path(), "w", encoding="utf-8") as f:
                json.dump(history, f, indent=4, ensure_ascii=False)
            logger.debug(f"Removed invalid path from history: {file_path}")
            return True
        except IOError as e:
            logger.error(f"Failed to update history file after removal: {e}")
            return False
            
    return False


def get_history() -> List[str]:
    """
    Retrieve the list of database file paths stored in the application history.

    :return: A list of strings containing the file paths.
    :rtype: List[str]
    """
    history_file = _get_history_path()
    
    if not history_file.exists():
        return []
    
    try:
        with open(history_file, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    except (json.JSONDecodeError, IOError) as e:
        logger.error(f"Error reading history file: {e}")
        return []


def update_history(file_path: str) -> None:
    """
    Add a new path to the history or move it to the top if it already exists.
    The list is capped at a maximum of 10 entries.

    :param file_path: The filesystem path of the .kdbx file to register.
    :type file_path: str
    :return: None
    :rtype: None
    """
    if not file_path:
        return

    history = get_history()
    if file_path in history:
        history.remove(file_path)

    history.insert(0, file_path)
    history = history[:10]

    try:
        with open(_get_history_path(), "w", encoding="utf-8") as f:
            json.dump(history, f, indent=4, ensure_ascii=False)
        
        update_emergency_heartbeat()
        logger.debug(f"History and Emergency Heartbeat updated for: {file_path}")

    except IOError as e:
        logger.error(f"Failed to save history file: {e}")


def clear_history() -> bool:
    """
    Delete the history file from the filesystem.

    :return: True if the file was deleted or didn't exist, False if an error occurred.
    :rtype: bool
    """
    history_file = _get_history_path()
    
    try:
        if history_file.exists():
            history_file.unlink()
            logger.info("History file deleted successfully.")
        else:
            logger.debug("Clear history called, but file does not exist.")
        
        update_emergency_heartbeat()
        return True

    except OSError as e:
        logger.error(f"Failed to delete history file: {e}")
        return False


def truncate_paths_middle(paths: List[str], max_length: int = 22) -> List[Dict[str, str]]:
    """
    Processes a list of file paths, truncating those that exceed 
    the maximum length, retaining the beginning and end (e.g. C:\\User...boveda.kdbx).

    :param paths: A list of file path strings to be processed.
    :type paths: List[str]
    :param max_length: The maximum allowed length for the display string. Defaults to 22.
    :type max_length: int
    :return: A list of dictionaries containing 'raw' (original) and 'display' (truncated) paths.
    :rtype: List[Dict[str, str]]
    """
    result = []
    
    for path in paths:
        if not path or len(path) <= max_length:
            result.append({"raw": path, "display": path})
            continue
            
        ellipsis = "..."
        chars_left = max_length - len(ellipsis)
        
        front_len = chars_left // 2
        back_len = chars_left - front_len
        
        truncated = f"{path[:front_len]}{ellipsis}{path[-back_len:]}"
        result.append({"raw": path, "display": truncated})
        
    return result


def load_last_history_path() -> bool:
    """
    Retrieves the most recently used database file path from the history
    and sets it as the current FILE_PATH in the application settings if it 
    still exists on disk.

    :return: True if a valid path was found and loaded, False otherwise.
    :rtype: bool
    """
    history = get_history()
    
    if history:
        last_path = history[0]
        if Path(last_path).exists():
            settings.FILE_PATH = last_path
            logger.info(f"Loaded last used database file from history: {settings.FILE_PATH}")
            return True
        else:
            logger.debug(f"History path found ('{last_path}') but file no longer exists on disk.")
            remove_from_history(file_path=last_path)
            
    logger.info("No database file specified and no valid history found.")
    return False