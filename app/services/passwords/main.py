import threading
import logging

from app.core.config import settings
from .find_duplicates import duplicate_password_audit_task


logger = logging.getLogger(settings.PROJECT_NAME)


def start_password_security_audits() -> None:
    """
    Initialize and launch all password-related security audit services.

    :return: None
    :rtype: None
    """
    logger.info("Launching password security audit services...")

    dup_audit_thread = threading.Thread(
        target=duplicate_password_audit_task, 
        daemon=True,
        name="DuplicatePasswordAudit"
    )
    dup_audit_thread.start()

    # NOTE: Future audits (weak passwords, pwned check) will be started here
    # following the same pattern.