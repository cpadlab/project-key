import time
import logging
import hashlib
import urllib.request

from app.core.config import settings
from app.controllers.kdbx.operations import list_all_entries, update_entry
from app.controllers.kdbx.models import EntryModel

logger = logging.getLogger(settings.PROJECT_NAME)

PWNED_TAG = "pwned"


def _is_password_pwned(password: str) -> bool:
    """
    Check if a password has been leaked using the Have I Been Pwned API.
    
    :param password: The plaintext password to check.
    :return: True if the password was found in a breach, False otherwise.
    """
    if not password:
        return False

    sha1_hash = hashlib.sha1(password.encode('utf-8')).hexdigest().upper()
    prefix, suffix = sha1_hash[:5], sha1_hash[5:]

    url = f"https://api.pwnedpasswords.com/range/{prefix}"
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': f'{settings.PROJECT_NAME}-Audit'})
        with urllib.request.urlopen(req, timeout=settings.UPDATE_TIMEOUT) as response:
            hashes = (line.split(':') for line in response.read().decode('utf-8').splitlines())
            return any(h_suffix == suffix for h_suffix, _ in hashes)
            
    except Exception as e:
        logger.error(f"Failed to connect to HIBP API: {e}")
        return False


def pwned_password_audit_task() -> None:
    """
    Background loop that checks for leaked passwords and updates entry tags.

    :return: None
    :rtype: None
    """
    while True:
        entries = list_all_entries()
        if not entries:
            time.sleep(settings.PASSWORD_AUDIT_INTERVAL)
            continue

        logger.debug("Executing scheduled Have I Been Pwned (HIBP) audit...")

        for entry in entries:
            is_pwned = _is_password_pwned(entry.password)
            
            changed = False
            current_tags = list(entry.tags)

            if is_pwned and PWNED_TAG not in current_tags:
                current_tags.append(PWNED_TAG)
                entry.tags = current_tags
                changed = True
                logger.warning(f"CRITICAL: Password for '{entry.title}' found in a data breach!")

            elif not is_pwned and PWNED_TAG in current_tags:
                current_tags.remove(PWNED_TAG)
                entry.tags = current_tags
                changed = True
                logger.info(f"Security Update: Entry '{entry.title}' is no longer flagged as pwned.")

            if changed and entry.uuid:
                update_entry(entry.uuid, entry)

        time.sleep(settings.PASSWORD_AUDIT_INTERVAL)