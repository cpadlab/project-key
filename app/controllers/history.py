import json
from pathlib import Path
from typing import List

from app.core.config import settings
from app.utils.logger import logger


def _get_history_path() -> Path:
    """
    Calculate the full filesystem path to the history file and ensure 
    the parent directory exists.

    :return: A Path object pointing to the history JSON file.
    :rtype: Path
    """
    temp_path = Path(settings.TEMP_DIR)
    temp_path.mkdir(parents=True, exist_ok=True)
    return temp_path / settings.HISTORY_FILENAME


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
        logger.debug(f"History updated with: {file_path}")
    except IOError as e:
        logger.error(f"Failed to save history file: {e}")