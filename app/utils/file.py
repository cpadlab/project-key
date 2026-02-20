from pathlib import Path
from typing import Optional

from app.utils.logger import logger


def get_resolved_path(path: str, suffix: Optional[str] = None) -> Path:
    """
    Convert a string path to an absolute Path object and optionally 
    enforce a specific file extension.

    :param path: The raw input path string.
    :type path: str
    :param suffix: Optional extension to enforce (e.g., '.kdbx').
    :type suffix: Optional[str]
    :return: A resolved absolute Path object.
    :rtype: Path
    """
    target = Path(path).resolve()
    if suffix and target.suffix.lower() != suffix.lower():
        target = target.with_suffix(suffix)
    return target


def ensure_parent_exists(path: Path) -> None:
    """
    Ensure that the parent directory of the given path exists, 
    creating it and any necessary intermediate directories.

    :param path: The Path object whose parent directory should be verified.
    :type path: Path
    :return: None
    :rtype: None
    """
    path.parent.mkdir(parents=True, exist_ok=True)


def is_path_available(path: Path, log_error: bool = True) -> bool:
    """
    Check if a filesystem path is available for creation (i.e., it does not exist).

    :param path: The Path object to verify.
    :type path: Path
    :param log_error: If True, logs an error message if the path is already taken.
    :type log_error: bool
    :return: True if the path is available, False otherwise.
    :rtype: bool
    """
    if path.exists():
        if log_error:
            logger.error(f"File already exists at: {path}")
        return False
    return True


def validate_and_prepare_path(path: str, suffix: str) -> Optional[Path]:
    """
    High-level utility to resolve a path, enforce a suffix, ensure 
    directory existence, and verify availability.

    :param path: The raw input path string.
    :type path: str
    :param suffix: The required file extension.
    :type suffix: str
    :return: A ready-to-use Path object if all checks pass; None otherwise.
    :rtype: Optional[Path]
    """
    try:
        target_path = get_resolved_path(path, suffix)
        ensure_parent_exists(target_path)
        if not is_path_available(target_path):
            return None
        return target_path
    except Exception as e:
        logger.error(f"Unexpected error validating path '{path}': {e}")
        return None