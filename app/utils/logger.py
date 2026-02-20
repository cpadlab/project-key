import logging
import sys
from pathlib import Path

from app.core.config import settings


def setup_logger() -> logging.Logger:
    """
    Initialize the application logger

    :return: A configured logging.Logger instance.
    :rtype: logging.Logger
    """
    logger = logging.getLogger(settings.PROJECT_NAME)
    
    numeric_level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)
    logger.setLevel(numeric_level)

    if not logger.handlers:
        formatter = logging.Formatter(
            fmt="%(asctime)s | %(levelname)s | %(message)s", datefmt="%Y-%m-%d %H:%M:%S"
        )

        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(numeric_level)
        console_handler.setFormatter(formatter)

        logger.addHandler(console_handler)

        log_dir = Path(settings.LOG_DIR)
        log_file = log_dir / settings.LOG_FILENAME
        log_dir.mkdir(parents=True, exist_ok=True)

        file_handler = logging.FileHandler(log_file, encoding="utf-8")
        file_handler.setLevel(numeric_level)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)

    return logger


def update_logger_level() -> None:
    """
    Updates the logger and all its handlers to the current 
    LOG_LEVEL defined in settings.
    """
    numeric_level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)
    logger.setLevel(numeric_level)
    for handler in logger.handlers:
        handler.setLevel(numeric_level)


logger = setup_logger()