import pandas as pd
import logging
from typing import List, Dict, Optional

from app.core.config import settings
from app.controllers.kdbx.models import EntryModel
from app.controllers.kdbx.operations import add_entry, list_all_entries
from app.utils.file import get_resolved_path


logger = logging.getLogger(settings.PROJECT_NAME)

DUPLICATE_TAG = "duplicate"
PRESETS = {
    "chrome": {
        "title": "name",
        "url": "url",
        "username": "username",
        "password": "password"
    },
    "firefox": {
        "title": "hostname",
        "url": "url",
        "username": "username",
        "password": "password"
    },
    "bitwarden": {
        "title": "name",
        "url": "login_uri",
        "username": "login_username",
        "password": "login_password",
        "notes": "notes"
    },
    "keepass": {
        "title": "Title",
        "url": "URL",
        "username": "Username",
        "password": "Password",
        "notes": "Notes"
    }
}


def get_csv_columns(file_path: str) -> List[str]:
    """
    Read the CSV file and return only the column names after path validation.

    :param file_path: The filesystem path to the CSV file.
    :type file_path: str
    :return: A list of column headers, or an empty list if the file is missing or invalid.
    :rtype: List[str]
    """
    path = get_resolved_path(file_path)
    if not path.exists():
        logger.error(f"CSV column lookup failed: File not found at '{path}'")
        return []

    try:
        df = pd.read_csv(path, nrows=0)
        return df.columns.tolist()
    except Exception as e:
        logger.error(f"Failed to read CSV headers from {path}: {e}")
        return []


def parse_csv_to_models(
    file_path: str, preset_name: Optional[str] = None, manual_mapping: Optional[Dict[str, str]] = None
) -> List[EntryModel]:
    """
    Convert a CSV file into a list of EntryModel instances for preview.

    :param file_path: Path to the source CSV file.
    :type file_path: str
    :param preset_name: Name of a predefined preset (e.g., 'chrome', 'firefox').
    :type preset_name: Optional[str]
    :param manual_mapping: A dictionary mapping model fields to CSV columns.
    :type manual_mapping: Optional[Dict[str, str]]
    :return: A list of EntryModel objects.
    :rtype: List[EntryModel]
    """
    path = get_resolved_path(file_path)
    if not path.exists():
        logger.error(f"CSV parsing failed: Source file not found at '{path}'")
        return []
    
    mapping = manual_mapping or PRESETS.get(preset_name)
    
    if not mapping:
        logger.error("No valid mapping configuration provided for CSV import.")
        return []

    try:
        df = pd.read_csv(path).fillna("")
        entries = []

        for _, row in df.iterrows():
            try:
                title = str(row.get(mapping.get("title"), "Imported Entry"))
                password = str(row.get(mapping.get("password"), ""))

                if not title or not password:
                    continue

                entry = EntryModel(
                    title=title,
                    username=str(row.get(mapping.get("username"), "")),
                    password=password,
                    url=str(row.get(mapping.get("url"), "")),
                    notes=str(row.get(mapping.get("notes"), "")),
                    group="Imported"
                )
                entries.append(entry)
            except Exception as row_err:
                logger.warning(f"Skipping row due to processing error: {row_err}")
                continue

        logger.info(f"Successfully parsed {len(entries)} entries from CSV.")
        return entries

    except Exception as e:
        logger.error(f"Critical error during CSV parsing: {e}")
        return []


def execute_final_import(entries: List[EntryModel], target_group: str) -> Dict[str, int]:
    """
    Persist a list of EntryModel instances into the active vault.

    :param entries: List of models to be imported.
    :type entries: List[EntryModel]
    :param target_group: The destination group name in the vault.
    :type target_group: str
    :return: A dictionary with 'success' and 'failed' counts.
    :rtype: Dict[str, int]
    """
    stats = {"success": 0, "failed": 0}
    current_entries = list_all_entries()
    existing_keys = {(e.title, e.username) for e in current_entries}
    
    for entry in entries:
        entry.group = target_group
        
        if (entry.title, entry.username) in existing_keys:
            if DUPLICATE_TAG not in entry.tags:
                entry.tags.append(DUPLICATE_TAG)
            logger.info(f"Import: Duplicate detected for '{entry.title}' (User: {entry.username}). Tagging...")

        if add_entry(entry):
            stats["success"] += 1
            existing_keys.add((entry.title, entry.username))
        else:
            stats["failed"] += 1
            
    logger.info(f"Import process completed. Success: {stats['success']}, Failed: {stats['failed']}")
    return stats