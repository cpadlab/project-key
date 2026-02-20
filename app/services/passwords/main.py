import threading
import logging

from app.core.config import settings
from .find_duplicates import duplicate_password_audit_task
from .weak_passwords import weak_password_audit_task
from .pwned_check import pwned_password_audit_task


logger = logging.getLogger(settings.PROJECT_NAME)


def start_password_security_audits() -> None:
    """
    Initialize and launch all password-related security audit services.

    :return: None
    :rtype: None
    """
    logger.info("Launching password security audit services...")

    dup_thread = threading.Thread(
        target=duplicate_password_audit_task, 
        daemon=True,
        name="DuplicatePasswordAudit"
    )
    dup_thread.start()
    logger.info("Duplicate password audit service started.")
    logger.debug(f"Thread '{dup_thread.name}' is now running in background.")

    weak_thread = threading.Thread(
        target=weak_password_audit_task,
        daemon=True,
        name="WeakPasswordAudit"
    )
    weak_thread.start()
    logger.info("Weak password audit service started.")
    logger.debug(f"Thread '{weak_thread.name}' is now running in background.")

    if settings.PWNED_AUDIT_ENABLED:
        pwned_thread = threading.Thread(
            target=pwned_password_audit_task,
            daemon=True,
            name="PwnedPasswordAudit"
        )
        pwned_thread.start()
        logger.info("HIBP breach audit service enabled and started.")
        logger.debug(f"Thread '{pwned_thread.name}' is now running in background.")
    else:
        logger.debug("HIBP breach audit service is disabled in settings.")