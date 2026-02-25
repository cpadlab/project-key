import json
import uuid
import logging
from datetime import datetime
from typing import List, Optional, Literal
from pykeepass.group import Group
from pykeepass import PyKeePass

from app.core.config import settings
from app.controllers.kdbx.manager import get_active_vault
from app.controllers.kdbx.models import EntryModel, GroupModel
from app.controllers.kdbx.backups import execute_backup_rotation


logger = logging.getLogger(settings.PROJECT_NAME)


def _save_vault_safely(vault: PyKeePass) -> None:
    """
    Helper utility to perform automated backup rotation before persisting changes.

    :param vault: The active PyKeePass instance to be saved.
    :type vault: PyKeePass
    :return: None
    :rtype: None
    """
    if settings.FILE_PATH:
        execute_backup_rotation(settings.FILE_PATH)
    vault.save()


def sort_entries(
    entries: List[EntryModel], sort_by: Literal["title", "created_at", "updated_at"] = "title", reverse: bool = False
) -> List[EntryModel]:
    """
    Sort a list of EntryModel objects based on a specific attribute.

    :param entries: The list of entries to sort.
    :type entries: List[EntryModel]
    :param sort_by: The field to sort by ('title', 'created_at', 'updated_at').
    :type sort_by: str
    :param reverse: If True, sorts in descending order (e.g., Z-A or newest first).
    :type reverse: bool
    :return: A sorted list of EntryModel instances.
    :rtype: List[EntryModel]
    """
    valid_fields = ["title", "created_at", "updated_at"]
    if sort_by not in valid_fields:
        logger.error(f"Invalid entry sort field: '{sort_by}'. Use one of {valid_fields}")
        return entries

    return sorted(
        entries, 
        key=lambda x: (getattr(x, sort_by) or ""), 
        reverse=reverse
    )


def sort_groups(
    groups: List[GroupModel], sort_by: Literal["name", "created_at", "updated_at"] = "name", reverse: bool = False
) -> List[GroupModel]:
    """
    Sort a list of GroupModel objects based on name or metadata timestamps.

    :param groups: The list of groups to sort.
    :type groups: List[GroupModel]
    :param sort_by: The field to sort by ('name', 'created_at', 'updated_at').
    :type sort_by: str
    :param reverse: If True, sorts in descending order.
    :type reverse: bool
    :return: A sorted list of GroupModel instances.
    :rtype: List[GroupModel]
    """
    valid_fields = ["name", "created_at", "updated_at"]
    if sort_by not in valid_fields:
        logger.error(f"Invalid group sort field: '{sort_by}'. Use one of {valid_fields}")
        return groups

    return sorted(
        groups, 
        key=lambda x: (getattr(x, sort_by) or ""), 
        reverse=reverse
    )


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
    entries = [EntryModel.from_pykeepass(e) for e in vault.entries]
    return sort_entries(entries)


def list_groups() -> List[GroupModel]:
    """
    Retrieve all groups defined in the vault, excluding the Root container.

    :return: A list of groups mapped to GroupModel.
    :rtype: List[GroupModel]
    """
    vault = get_active_vault()
    if not vault:
        return []

    logger.debug("Fetching flat group list (JSON parsed)...")
    groups = [
        GroupModel.from_pykeepass(g) 
        for g in vault.groups 
        if g.name != "Root"
    ]
    return sort_groups(groups)


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
    entries = [EntryModel.from_pykeepass(e) for e in group.entries]
    return sort_entries(entries)


def list_recycle_bin_entries() -> List[EntryModel]:
    """
    Retrieve all entries currently residing in the Recycle Bin group.

    :return: A list of entries found in the Recycle Bin.
    :rtype: List[EntryModel]
    """
    return list_entries_by_group(settings.RECYCLE_BIN_GROUP_NAME)


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
    if not vault or get_group(group_data.name):
        return False

    try:
        notes_json = json.dumps({
            "icon": group_data.icon,
            "color": group_data.color
        })
        vault.add_group(vault.root_group, group_data.name, notes=notes_json)
        _save_vault_safely(vault=vault)
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
    
    if not group or group.name == settings.PERSONAL_GROUP_NAME:
        return False

    try:
        group.name = data.name
        group.notes = json.dumps({
            "icon": data.icon,
            "color": data.color
        })
        _save_vault_safely(vault=vault)
        return True
    except Exception as e:
        logger.error(f"Failed to update group: {e}")
        return False


def delete_group(group_name: str, force_delete_entries: bool = False, move_entries_to: Optional[str] = settings.PERSONAL_GROUP_NAME) -> bool:
    """
    Delete a group with safety checks for contained entries.

    :param group_name: Name of the group to delete.
    :param force_delete_entries: If True, deletes everything inside.
    :param move_entries_to: If provided, moves entries to this group before deletion.
    :return: True if deleted successfully, False otherwise.
    """
    vault = get_active_vault()
    group = get_group(group_name)

    if not group or group.name == "Root" or group.name == settings.PERSONAL_GROUP_NAME:
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
        _save_vault_safely(vault=vault)
        logger.info(f"Group '{group_name}' deleted successfully.")
        return True
    except Exception as e:
        logger.error(f"Error deleting group: {e}")
        return False


def add_entry(entry: EntryModel) -> bool:
    """
    Register a new entry in the vault with automatic group resolution.

    :param entry: The data model containing all entry information.
    :type entry: EntryModel
    :return: True if the entry was added and the vault saved successfully, False otherwise.
    :rtype: bool
    """
    vault = get_active_vault()
    if not vault:
        logger.warning("Attempted to add entry but no vault session is active.")
        return False

    group_name = entry.group if entry.group and entry.group != "Root" else settings.PERSONAL_GROUP_NAME
    target_group = get_group(group_name)
    
    if not target_group:
        logger.info(f"Creating missing group: {group_name}")
        target_group = vault.add_group(vault.root_group, group_name)

    try:
        new_entry = vault.add_entry(
            target_group, entry.title, entry.username, entry.password, 
            url=entry.url, notes=entry.notes, tags=entry.tags
        )
        
        if entry.color:
            new_entry.set_custom_property("color", entry.color)

        if entry.icon is not None:
            new_entry.set_custom_property("icon", str(entry.icon))

        new_entry.set_custom_property("is_favorite", str(entry.is_favorite))
        
        if entry.totp_seed:
            new_entry.otp = entry.totp_seed
            
        _save_vault_safely(vault=vault)
        logger.info(f"Entry '{entry.title}' successfully added to group '{group_name}'.")
        return True

    except Exception as e:
        logger.error(f"Failed to add entry '{entry.title}': {e}")
        return False


def update_entry(entry_uuid: str, data: EntryModel) -> bool:
    """
    Update an existing database entry identified by its UUID.

    This function synchronizes standard KDBX fields and custom Project Key 
    attributes. If the group name in the provided data differs from the 
    current one, the entry is automatically moved to the new group.

    :param entry_uuid: The unique identifier of the entry to update.
    :type entry_uuid: str
    :param data: The new data model to apply.
    :type data: EntryModel
    :return: True if the update was successful, False otherwise.
    :rtype: bool
    """
    vault = get_active_vault()
    if not vault:
        return False

    try:
        parsed_uuid = uuid.UUID(entry_uuid)
    except (ValueError, AttributeError):
        logger.error(f"Invalid UUID format: {entry_uuid}")
        return False

    entry = vault.find_entries(uuid=parsed_uuid, first=True)
    if not entry:
        logger.error(f"Update failed: Entry with UUID {entry_uuid} not found.")
        return False

    try:
        entry.title = data.title
        entry.username = data.username
        entry.password = data.password
        entry.url = data.url
        entry.notes = data.notes
        entry.tags = data.tags
        entry.otp = data.totp_seed

        entry.set_custom_property("icon", str(data.icon))        
        entry.set_custom_property("color", data.color)
        entry.set_custom_property("is_favorite", str(data.is_favorite))
        
        if data.group and data.group != entry.group.name:
            move_entry(entry_uuid, data.group)
            
        _save_vault_safely(vault=vault)
        logger.info(f"Entry '{data.title}' (UUID: {entry_uuid}) updated successfully.")
        return True

    except Exception as e:
        logger.error(f"Failed to update entry {entry_uuid}: {e}")
        return False


def delete_entry(entry_uuid: str, permanent: bool = False) -> bool:
    """
    Remove an entry from the vault, either logically or permanently.


    :param entry_uuid: The unique identifier (UUID) of the entry to delete.
    :type entry_uuid: str
    :param permanent: If True, deletes the entry permanently. If False, 
                      moves it to the Recycle Bin. Defaults to False.
    :type permanent: bool
    :return: True if the operation was successful and the vault saved, False otherwise.
    :rtype: bool
    """
    vault = get_active_vault()
    if not vault:
        return False

    entry = vault.find_entries(uuid=entry_uuid, first=True)
    if not entry:
        logger.warning(f"Delete aborted: No entry found with UUID {entry_uuid}.")
        return False

    try:
        if permanent:
            vault.delete_entry(entry)
            logger.info(f"Entry {entry_uuid} permanently deleted.")
        else:
            timestamp = datetime.now().isoformat()
            entry.set_custom_property("deleted_at", timestamp)
            move_entry(entry_uuid, settings.RECYCLE_BIN_GROUP_NAME)
            logger.info(f"Entry {entry_uuid} moved to Recycle Bin.") 

        _save_vault_safely(vault=vault)
        return True

    except Exception as e:
        logger.error(f"Failed to delete entry {entry_uuid}: {e}")
        return False


def move_entry(entry_uuid: str, target_group_name: str) -> bool:
    """
    Relocate an entry to a different group within the vault.

    :param entry_uuid: The unique identifier of the entry to move.
    :type entry_uuid: str
    :param target_group_name: The destination group name.
    :type target_group_name: str
    :return: True if the move was successful, False otherwise.
    :rtype: bool
    """
    vault = get_active_vault()
    if not vault:
        return False

    entry = vault.find_entries(uuid=entry_uuid, first=True)
    if not entry:
        logger.error(f"Move failed: Entry {entry_uuid} not found.")
        return False
        
    target_group = get_group(target_group_name) or vault.add_group(vault.root_group, target_group_name)

    try:
        vault.move_entry(entry, target_group)
        _save_vault_safely(vault=vault)
        logger.debug(f"Entry {entry_uuid} moved to group '{target_group_name}'.")
        return True

    except Exception as e:
        logger.error(f"Failed to move entry {entry_uuid} to '{target_group_name}': {e}")
        return False