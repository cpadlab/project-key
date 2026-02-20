import urllib.request
import urllib.error
from typing import Optional

from app.core.config import settings
from app.utils.logger import logger


def _fetch_latest_version() -> Optional[str]:
    """
    Fetch the latest application version from the configured remote repository.

    :return: The latest version string if the request is successful and the content can be read; otherwise, None.
    :rtype: Optional[str]
    """
    try:
        req = urllib.request.Request(settings.UPDATE_URL)
        with urllib.request.urlopen(req, timeout=settings.UPDATE_TIMEOUT) as response:
            return response.read().decode('utf-8').strip()
    except urllib.error.URLError as e:
        logger.error(f"Network error while checking for updates: {e.reason}")
    except Exception as e:
        logger.error(f"Unexpected error while fetching the version: {e}")
    return None


def check_for_updates() -> None:
    """
    Check if the current application version matches the latest available version 
    in the remote repository and log the result.

    :return: Nothing. The function only performs logging operations based on the version comparison.
    :rtype: None
    """
    logger.debug("Checking for available updates...")

    latest_version = _fetch_latest_version()
    if not latest_version:
        return 
        
    if latest_version != settings.VERSION:
        logger.warning(
            f"Update available! "
            f"Local version: {settings.VERSION} -> Latest version: {latest_version}"
        )
    else:
        logger.info(f"{settings.PROJECT_NAME} is up to date with the latest version.")