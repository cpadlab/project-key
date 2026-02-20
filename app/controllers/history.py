import json
from pathlib import Path
from typing import List

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