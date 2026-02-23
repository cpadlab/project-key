from pathlib import Path
import urllib.request
import urllib.parse
import logging
from typing import Optional

from app.core.config import settings


logger = logging.getLogger(settings.PROJECT_NAME)


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


def validate_entry_url(url_or_path: str) -> bool:
    """
    Validate whether the application entry point is a reachable web URL 
    or an existing local HTML file.

    :param url_or_path: The string to be validated, which can be a remote 
                        URL (http/https) or a local filesystem path.
    :type url_or_path: str
    :return: True if the remote URL returns a 200 status code or if the 
             local HTML file exists; False otherwise.
    :rtype: bool
    """
    parsed = urllib.parse.urlparse(url_or_path)
    
    if parsed.scheme in ('http', 'https'):
        try:
            req = urllib.request.Request(url_or_path, method='HEAD')
            with urllib.request.urlopen(req, timeout=5) as response:
                return response.status == 200
        except Exception as e:
            logger.error(f"Error validating remote URL '{url_or_path}': {e}")
            return False

    try:
        local_path = Path(url_or_path).resolve()
        if local_path.exists() and local_path.suffix.lower() == '.html':
            return True
    except Exception as e:
        logger.error(f"Error validating local path '{url_or_path}': {e}")
        return False
    
    logger.error(f"Local file does not exist or is not an HTML file: {local_path}")
    return False