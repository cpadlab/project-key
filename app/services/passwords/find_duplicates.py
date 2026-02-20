import time
import logging
from collections import defaultdict
from typing import List, Dict

from app.core.config import settings
from app.controllers.kdbx.operations import list_all_entries, update_entry
from app.controllers.kdbx.models import EntryModel


logger = logging.getLogger(settings.PROJECT_NAME)


def get_duplicate_map() -> Dict[str, List[EntryModel]]:
    """
    Map all entries in the vault by their password to identify duplicates.

    :return: A dictionary where keys are passwords and values are lists 
             of EntryModel objects sharing that password.
    :rtype: Dict[str, List[EntryModel]]
    """
    entries = list_all_entries()
    if not entries:
        return {}

    password_map = defaultdict(list)
    for entry in entries:
        password_map[entry.password].append(entry)

    return password_map


def duplicate_password_audit_task() -> None:
    """
    Background execution loop for detecting and tagging duplicate passwords.

    This task performs the following actions:
    1. Scans all entries and identifies reused passwords.
    2. Adds a 'duplicate' tag to entries with shared passwords if not present.
    3. Removes the 'duplicate' tag from entries that now have unique passwords.
    4. Persists changes to the vault via the operations controller.

    :return: None
    :rtype: None
    """
    while True:
        logger.debug("Executing scheduled duplicate password audit and tagging...")
        
        password_map = get_duplicate_map()
        if not password_map:
            time.sleep(settings.PASSWORD_AUDIT_INTERVAL)
            continue

        for _, entries in password_map.items():
            is_duplicated = len(entries) > 1

            for entry in entries:
                changed = False
                current_tags = list(entry.tags)

                if is_duplicated and settings.DUPLICATE_TAG not in current_tags:
                    current_tags.append(settings.DUPLICATE_TAG)
                    entry.tags = current_tags
                    changed = True
                    logger.warning(f"Security Risk: Tagging duplicated entry '{entry.title}'")

                elif not is_duplicated and settings.DUPLICATE_TAG in current_tags:
                    current_tags.remove(settings.DUPLICATE_TAG)
                    entry.tags = current_tags
                    changed = True
                    logger.info(f"Security Fixed: Removing duplicate tag from '{entry.title}'")

                if changed and entry.uuid:
                    update_entry(entry.uuid, entry)

        time.sleep(settings.PASSWORD_AUDIT_INTERVAL)