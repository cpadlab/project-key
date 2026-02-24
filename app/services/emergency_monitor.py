import time
import threading
import logging
from pathlib import Path

from app.core.config import settings
from app.controllers.emergency import is_emergency_triggered
from app.controllers.export import export_vault_data
from app.controllers.kdbx.manager import get_active_vault


logger = logging.getLogger(settings.PROJECT_NAME)


def emergency_monitor_task() -> None:
    """
    Background execution loop that monitors user inactivity for emergency access.

    :return: None
    :rtype: None
    """
    while True:
        if not get_active_vault():
            time.sleep(settings.EMERGENCY_CHECK_INTERVAL)
            continue
        
        if is_emergency_triggered():
            logger.critical("EMERGENCY TRIGGERED: Inactivity threshold exceeded.")

            recovery_path = str(Path(settings.TEMP_DIR) / settings.RECOVERY_KIT_NAME)
            success = export_vault_data(recovery_path, format="json")
            
            if success:
                logger.info(f"Recovery Kit generated at: {recovery_path}")
            
            break
            
        time.sleep(settings.EMERGENCY_CHECK_INTERVAL)


def start_emergency_monitor_service() -> None:
    """
    Initialize and launch the Emergency Access Monitor service in a separate thread.

    :return: None
    :rtype: None
    """
    emergency_thread = threading.Thread(
        target=emergency_monitor_task,
        daemon=True,
        name="EmergencyMonitor"
    )
    emergency_thread.start()
    logger.info("Emergency Access Monitor service started.")