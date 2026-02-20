import time
import logging
import threading
from datetime import datetime, timedelta

from app.core.config import settings
from app.controllers.kdbx.operations import list_recycle_bin_entries, delete_entry


logger = logging.getLogger(settings.PROJECT_NAME)


def auto_empty_recycle_bin_task() -> None:
    """
    Background execution loop for automated Recycle Bin maintenance.

    :return: None
    :rtype: None
    """
    while True:
        logger.debug("Checking Recycle Bin for expired entries...")
        entries = list_recycle_bin_entries()
        now = datetime.now()
        retention_delta = timedelta(days=settings.RECYCLE_BIN_RETENTION_DAYS)

        for entry in entries:
            if entry.deleted_at:
                try:
                    deletion_date = datetime.fromisoformat(entry.deleted_at)
                    if now - deletion_date > retention_delta:
                        logger.info(f"Auto-purge: Removing expired entry '{entry.title}'")
                        delete_entry(entry.uuid, permanent=True)
                except ValueError:
                    logger.error(f"Invalid timestamp format for entry {entry.title}")

        time.sleep(settings.OTHER_SERVICES_INTERVAL)


def start_recycle_bin_service() -> None:
    """
    Initialize and launch the Recycle Bin auto-empty service.

    :return: None
    :rtype: None
    """
    audit_thread = threading.Thread(
        target=auto_empty_recycle_bin_task,
        daemon=True,
        name="RecycleBinAudit"
    )
    audit_thread.start()
    logger.info("Recycle Bin auto-empty service successfully initialized.")