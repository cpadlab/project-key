import logging
from typing import List, Optional
from pykeepass.group import Group

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


def get_group(name: str) -> Optional[Group]:
    """
    Check if a group exists in the vault and return the native object.

    :param name: The name of the group to search for.
    :type name: str
    :return: The pykeepass Group instance if found, None otherwise.
    :rtype: Optional[Group]
    """
    vault = get_active_vault()
    if not vault:
        return None
    
    return vault.find_groups(name=name, first=True)


def create_group(group_data: GroupModel) -> bool:
    """
    Create a new group in the root of the vault. 
    Project Key enforces a flat structure.

    :param group_data: Model containing the name, icon, and color.
    :type group_data: GroupModel
    :return: True if created successfully, False if it already exists or fails.
    :rtype: bool
    """
    vault = get_active_vault()
    if not vault:
        return False

    if get_group(group_data.name):
        logger.warning(f"Group '{group_data.name}' already exists.")
        return False

    try:
        new_group = vault.add_group(vault.root_group, group_data.name, icon=group_data.icon)
        
        if group_data.color:
            new_group.set_custom_property("color", group_data.color)
        
        vault.save()
        logger.info(f"Group '{group_data.name}' created successfully.")
        return True

    except Exception as e:
        logger.error(f"Failed to create group: {e}")
        return False


def update_group(group_name: str, data: GroupModel) -> bool:
    """
    Update the properties of an existing group.

    :param group_name: The current name of the group to edit.
    :type group_name: str
    :param data: The new data to apply (name, icon, color).
    :type data: GroupModel
    :return: True if updated successfully.
    :rtype: bool
    """
    vault = get_active_vault()
    group = get_group(group_name)

    if not group:
        logger.error(f"Cannot update: Group '{group_name}' not found.")
        return False

    try:
        group.name = data.name
        group.icon = data.icon
        
        if data.color:
            group.set_custom_property("color", data.color)
        
        vault.save()
        logger.info(f"Group '{group_name}' updated to '{data.name}'.")
        return True

    except Exception as e:
        logger.error(f"Failed to update group: {e}")
        return False


def delete_group(group_name: str, force_delete_entries: bool = False, move_entries_to: Optional[str] = "Personal") -> bool:
    """
    Delete a group with safety checks for contained entries.

    :param group_name: Name of the group to delete.
    :param force_delete_entries: If True, deletes everything inside.
    :param move_entries_to: If provided, moves entries to this group before deletion.
    :return: True if deleted successfully, False otherwise.
    """
    vault = get_active_vault()
    group = get_group(group_name)

    if not group or group.name == "Root":
        logger.error("Invalid group deletion request.")
        return False

    entries_count = len(group.entries)

    if entries_count > 0:
        if move_entries_to:
            target_group = get_group(move_entries_to)
            if not target_group:
                target_group = vault.add_group(vault.root_group, move_entries_to)
            
            logger.info(f"Moving {entries_count} entries to '{move_entries_to}' before deletion.")
            for entry in group.entries:
                vault.move_entry(entry, target_group)
        
        elif not force_delete_entries:
            logger.warning(f"Group '{group_name}' is not empty. Use force or move entries.")
            return False

    try:
        vault.delete_group(group)
        vault.save()
        logger.info(f"Group '{group_name}' deleted successfully.")
        return True
    except Exception as e:
        logger.error(f"Error deleting group: {e}")
        return False