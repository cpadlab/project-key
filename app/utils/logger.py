import logging
import sys
import os

from app.core.config import settings


def setup_logger() -> logging.Logger:
    """
    Initialize the custom application logger with console and file output.

    :return: A configured logging.Logger instance.
    :rtype: logging.Logger
    """
    logger = logging.getLogger(settings.PROJECT_NAME)
    
    numeric_level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)
    logger.setLevel(numeric_level)

    if not logger.handlers:
        formatter = logging.Formatter(
            fmt="%(asctime)s | %(levelname)s | %(name)s | %(message)s", datefmt="%Y-%m-%d %H:%M:%S"
        )

        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(numeric_level)
        console_handler.setFormatter(formatter)

        logger.addHandler(console_handler)

        log_file = os.path.join(settings.LOG_DIR, settings.LOG_FILENAME)
        if not os.path.exists(settings.LOG_DIR):
            os.makedirs(settings.LOG_DIR)

        file_handler = logging.FileHandler(log_file, encoding="utf-8")
        file_handler.setLevel(numeric_level)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)

    return logger


logger = setup_logger()