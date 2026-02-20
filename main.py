import argparse
import os
import sys
import platform
from pathlib import Path

from app.utils.logger import logger, update_logger_level
from app.utils.cli import get_args
from app.core.config import settings
from app.gui.manager import GUIManager


def main(arguments: argparse.Namespace) -> None:
    """
    Main entry point for the Project Key application.

    Initializes configuration, sets up the logging system, logs system metadata, 
    checks for remote updates, and launches the graphical user interface.

    :param arguments: Parsed command-line arguments.
    :type arguments: argparse.Namespace
    :return: None
    :rtype: None
    """
    try:
        settings.load_from_ini(Path(arguments.config_file))
        settings.setup_with_args(arguments)

        update_logger_level()

        logger.info(f"--- {settings.PROJECT_NAME} v{settings.VERSION} initialized ---")
        
        logger.debug(f"Process PID: {os.getpid()}")
        logger.debug(f"Operating System: {platform.system()} {platform.release()} ({platform.machine()})")
        logger.debug(f"Python version: {platform.python_version()}")
        logger.debug(f"Work Directory: {os.getcwd()}")
        logger.debug(f"Configuration loaded from: {arguments.config_file}")
        logger.info(f"Log level set to: {settings.LOG_LEVEL}")
        
        if settings.FILE_PATH:
            logger.info(f"Database file: {settings.FILE_PATH}")
        else:
            logger.info("No database file specified")

        gui = GUIManager()
        gui.run()

    except FileNotFoundError as e:
        logger.critical(f"Critical initialization error: {e}")
        sys.exit(1)
    except Exception as e:
        logger.critical(f"An unexpected fatal error has occurred.: {e}", exc_info=True)
        sys.exit(1)


if __name__ == "__main__":
    main(arguments=get_args())