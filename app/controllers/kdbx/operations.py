import logging
from typing import List, Optional

from app.core.config import settings
from app.controllers.kdbx.manager import get_active_vault
from app.controllers.kdbx.models import EntryModel, GroupModel


logger = logging.getLogger(settings.PROJECT_NAME)


def list_all_entries() -> List[EntryModel]:
    """
    Retrieve every single entry stored in the KDBX file, regardless of its group.

    :return: A list of all database entries.
    :rtype: List[EntryModel]
    """
    vault = get_active_vault()
    if not vault:
        logger.warning("Attempted to list all entries but no vault session is active.")
        return []

    logger.debug("Fetching all entries from the active vault...")
    return [EntryModel.from_pykeepass(e) for e in vault.entries]


def list_groups() -> List[GroupModel]:
    """
    Retrieve all groups defined in the vault, excluding the Root container.

    :return: A list of groups mapped to GroupModel.
    :rtype: List[GroupModel]
    """
    vault = get_active_vault()
    if not vault:
        logger.warning("Attempted to list groups but no vault session is active.")
        return []

    logger.debug("Fetching flat group list from the vault...")
    return [
        GroupModel.from_pykeepass(g) 
        for g in vault.groups 
        if g.name != "Root"
    ]


def list_entries_by_group(group_name: str) -> List[EntryModel]:
    """
    List all database entries belonging to a specific group.

    :param group_name: The name of the group to filter entries by.
    :type group_name: str
    :return: A list of entries found within the specified group.
    :rtype: List[EntryModel]
    """
    vault = get_active_vault()
    if not vault:
        logger.warning(f"Attempted to list entries for group '{group_name}' but no vault is active.")
        return []

    group = vault.find_groups(name=group_name, first=True)
    if not group:
        logger.error(f"Group lookup failed: Group '{group_name}' not found in the vault.")
        return []

    logger.debug(f"Fetching entries for group: {group_name}")
    return [EntryModel.from_pykeepass(e) for e in group.entries]