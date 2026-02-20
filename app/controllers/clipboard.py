import time
import logging
import threading
import pyperclip

from app.core.config import settings


logger = logging.getLogger(settings.PROJECT_NAME)


def _delayed_clear(content_to_clear: str) -> None:
    """
    Wait for the configured interval and clear the clipboard if it 
    still contains the original sensitive data.

    :param content_to_clear: The specific string that was copied.
    :return: None
    """
    time.sleep(settings.CLIPBOARD_CLEAR_INTERVAL)
    
    try:
        current_clipboard = pyperclip.paste()
        
        if current_clipboard == content_to_clear:
            pyperclip.copy("")
            logger.info("Secure Clipboard: Sensitive data cleared automatically.")
        else:
            logger.debug("Secure Clipboard: Content changed by user, skipping clear.")
            
    except Exception as e:
        logger.error(f"Secure Clipboard: Failed to clear clipboard: {e}")


def copy_to_clipboard(text: str, is_sensitive: bool = True) -> None:
    """
    Copy text to the system clipboard with an optional auto-clear timer.

    :param text: The string to be copied to the clipboard.
    :param is_sensitive: If True, schedules a clear task. Defaults to True.
    :return: None
    """
    if not text:
        return

    try:
        pyperclip.copy(text)
        logger.debug("Content copied to clipboard.")

        if is_sensitive:
            clear_thread = threading.Thread(
                target=_delayed_clear, 
                args=(text,), 
                daemon=True,
                name="ClipboardClearThread"
            )
            clear_thread.start()
            logger.info(f"Clipboard will be cleared in {settings.CLIPBOARD_CLEAR_INTERVAL}s.")

    except Exception as e:
        logger.error(f"Failed to copy to clipboard: {e}")