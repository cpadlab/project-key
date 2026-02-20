import logging

from app.core.config import settings
from app.services.passwords.main import start_password_security_audits
from app.services.recycle_bin import start_recycle_bin_service


logger = logging.getLogger(settings.PROJECT_NAME)


def start_background_services() -> None:
    """
    Orchestrate the initialization of all application background services.

    :return: None
    :rtype: None
    """
    logger.info("Initializing background service orchestration...")
    
    start_password_security_audits()
    start_recycle_bin_service()

    logger.info("All background services have been successfully dispatched.")