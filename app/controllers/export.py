import pandas as pd
import logging
from typing import List, Optional, Literal

from app.core.config import settings
from app.controllers.kdbx.operations import list_all_entries, list_entries_by_group
from app.controllers.kdbx.models import EntryModel
from app.utils.file import get_resolved_path, ensure_parent_exists


logger = logging.getLogger(settings.PROJECT_NAME)


def _convert_to_dataframe(entries: List[EntryModel]) -> pd.DataFrame:
    """
    Transform a list of EntryModel objects into a cleaned Pandas DataFrame.
    
    This handles the conversion of Pydantic models to dictionaries and 
    strips sensitive metadata not needed for plain text export.
    """
    data = [entry.model_dump() for entry in entries]
    df = pd.DataFrame(data)

    internal_fields = ['uuid', 'auto_fill_config', 'deleted_at']
    df = df.drop(columns=internal_fields, errors='ignore')
    
    return df


def export_vault_data(file_path: str, format: Literal["csv", "json"] = "csv", group_name: Optional[str] = None) -> bool:
    """
    Export vault entries to a plain text file (CSV or JSON).

    :param file_path: Destination path for the exported file.
    :type file_path: str
    :param format: Export format ('csv' or 'json'). Defaults to 'csv'.
    :type format: str
    :param group_name: Optional name of the group to export.
    :type group_name: Optional[str]
    :return: True if export was successful, False otherwise.
    :rtype: bool
    """
    try:
        if group_name:
            logger.info(f"Exporting entries from group: '{group_name}'")
            entries = list_entries_by_group(group_name)
        else:
            logger.info("Exporting all entries (excluding Recycle Bin)...")
            all_entries = list_all_entries()
            entries = [e for e in all_entries if e.group != settings.RECYCLE_BIN_GROUP_NAME]

        if not entries:
            logger.warning("No entries found to export.")
            return False

        resolved_path = get_resolved_path(file_path)
        ensure_parent_exists(resolved_path)

        df = _convert_to_dataframe(entries)

        if format.lower() == "csv":
            df.to_csv(resolved_path, index=False, encoding="utf-8")
        elif format.lower() == "json":
            df.to_json(resolved_path, orient="records", indent=4, force_ascii=False)
        else:
            logger.error(f"Unsupported export format: {format}")
            return False

        logger.info(f"Successfully exported {len(entries)} entries to {resolved_path}")
        return True

    except Exception as e:
        logger.error(f"Failed to export data: {e}")
        return False