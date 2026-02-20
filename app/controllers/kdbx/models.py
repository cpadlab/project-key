from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any


class EntryModel(BaseModel):
    """
    Pydantic model representing a KDBX database entry.
    """
    title: str = Field(..., min_length=1)
    username: Optional[str] = None
    password: str
    url: Optional[str] = None
    notes: Optional[str] = None
    group: str = "Personal"
    color: Optional[str] = None
    icon: Optional[int] = None
    tags: List[str] = Field(default_factory=list)
    is_favorite: bool = False
    totp_seed: Optional[str] = None
    auto_fill_config: Optional[Dict[str, Any]] = None


class GroupModel(BaseModel):
    """
    Data model for KDBX groups.
    """
    name: str = Field(..., min_length=1)
    icon: Optional[int] = None
    color: Optional[str] = None