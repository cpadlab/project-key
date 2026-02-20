import shutil
import logging
from datetime import datetime
from pathlib import Path

from app.core.config import settings
from app.utils.file import ensure_parent_exists


logger = logging.getLogger(settings.PROJECT_NAME)


def execute_backup_rotation(source_path_str: str) -> None:
    """
    Create a timestamped backup of the current vault and rotate old copies.

    :param source_path_str: The absolute path to the active vault file.
    :type source_path_str: str
    :return: None
    """
    if not source_path_str:
        return

    source_path = Path(source_path_str)
    if not source_path.exists():
        return

    backup_folder = Path(settings.BACKUP_DIR)
    ensure_parent_exists(backup_folder / "dummy.txt")

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_filename = f"{source_path.stem}_{timestamp}{source_path.suffix}"
    backup_path = backup_folder / backup_filename

    try:
        shutil.copy2(source_path, backup_path)
        logger.debug(f"Backup created: {backup_filename}")
    except Exception as e:
        logger.error(f"Failed to create backup file: {e}")
        return

    try:
        existing_backups = sorted(
            [f for f in backup_folder.glob(f"{source_path.stem}_*{source_path.suffix}")],
            key=lambda x: x.stat().st_mtime,
            reverse=True
        )

        if len(existing_backups) > settings.BACKUP_MAX_COUNT:
            to_delete = existing_backups[settings.BACKUP_MAX_COUNT:]
            for old_file in to_delete:
                old_file.unlink()
                logger.debug(f"Rotated (deleted) old backup: {old_file.name}")

    except Exception as e:
        logger.error(f"Error during backup rotation: {e}")