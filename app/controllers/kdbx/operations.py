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


def find_entries(query: Optional[str] = None, group_name: Optional[str] = None, tags: Optional[List[str]] = None) -> List[EntryModel]:
    """
    Search for entries within the vault using flexible filtering criteria.

    :param query: Search string to match against title, username, URL, or notes.
    :type query: Optional[str]
    :param group_name: Optional name of the group to restrict the search.
    :type group_name: Optional[str]
    :param tags: Optional list of tags that entries must include.
    :type tags: Optional[List[str]]
    :return: A list of EntryModel instances matching the criteria.
    :rtype: List[EntryModel]
    """
    vault = get_active_vault()
    if not vault:
        logger.warning("Attempted to search entries but no vault session is active.")
        return []

    search_params = {}
    
    if group_name:
        target_group = vault.find_groups(name=group_name, first=True)
        if not target_group:
            logger.error(f"Search aborted: Group '{group_name}' does not exist.")
            return []
        search_params['group'] = target_group

    if tags:
        search_params['tags'] = tags

    entries = vault.find_entries(**search_params)

    if query:
        q = query.lower()
        entries = [
            e for e in entries 
            if (e.title and q in e.title.lower()) or 
               (e.username and q in e.username.lower()) or 
               (e.url and q in e.url.lower()) or 
               (e.notes and q in e.notes.lower())
        ]

    logger.debug(f"Search completed: {len(entries)} entries found.")
    return [EntryModel.from_pykeepass(e) for e in entries]