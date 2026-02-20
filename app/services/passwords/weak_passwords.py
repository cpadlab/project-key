import time
import logging
from typing import List

from app.core.config import settings
from app.controllers.kdbx.operations import list_all_entries, update_entry
from app.controllers.passwords import check_password_strength
from app.controllers.kdbx.models import EntryModel


logger = logging.getLogger(settings.PROJECT_NAME)
WEAK_TAG = "weak"


def calculate_global_health_score(entries: List[EntryModel]) -> float:
    """
    Calculate the overall security percentage of the vault.
    

    :param entries: List of entries to analyze.
    :return: A percentage score from 0 to 100.
    :rtype: float
    """
    if not entries:
        return 100.0

    total_possible_score = len(entries) * 4
    current_total_score = sum(check_password_strength(e.password)["score"] for e in entries)

    return (current_total_score / total_possible_score) * 100


def weak_password_audit_task() -> None:
    """
    Background loop that scans for weak passwords and updates entry tags.

    :return: None
    :rtype: None
    """
    while True:
        logger.debug("Executing scheduled weak password audit...")
        entries = list_all_entries()
        
        if not entries:
            time.sleep(settings.PASSWORD_AUDIT_INTERVAL)
            continue

        global_score = calculate_global_health_score(entries)
        logger.info(f"Vault Global Health Score: {global_score:.2f}%")

        for entry in entries:
            strength = check_password_strength(entry.password)
            is_weak = strength["score"] < 3
            
            changed = False
            current_tags = list(entry.tags)

            if is_weak and WEAK_TAG not in current_tags:
                current_tags.append(WEAK_TAG)
                entry.tags = current_tags
                changed = True
                logger.warning(f"Security Alert: Entry '{entry.title}' marked as weak (Score: {strength['score']})")

            elif not is_weak and WEAK_TAG in current_tags:
                current_tags.remove(WEAK_TAG)
                entry.tags = current_tags
                changed = True
                logger.info(f"Security Improved: Removing weak tag from '{entry.title}'")

            if changed and entry.uuid:
                update_entry(entry.uuid, entry)

        time.sleep(settings.PASSWORD_AUDIT_INTERVAL)