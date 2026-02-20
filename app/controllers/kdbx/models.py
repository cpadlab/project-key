from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from pykeepass.entry import Entry
from pykeepass.group import Group


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

    @classmethod
    def from_pykeepass(cls, kp_entry: Entry) -> "EntryModel":
        """
        Create an EntryModel instance from a pykeepass Entry object.

        :param kp_entry: The native pykeepass Entry instance.
        :type kp_entry: Entry
        :return: A validated EntryModel instance.
        :rtype: EntryModel
        """
        custom = kp_entry.custom_properties
        
        return cls(
            title=kp_entry.title or "Untitled",
            username=kp_entry.username,
            password=kp_entry.password,
            url=kp_entry.url,
            notes=kp_entry.notes,
            group=kp_entry.group.name if kp_entry.group else "Personal",
            color=custom.get("color"),
            icon=kp_entry.icon,
            tags=kp_entry.tags or [],
            is_favorite=custom.get("is_favorite") == "True",
            totp_seed=kp_entry.otp,
            auto_fill_config=None
        )


class GroupModel(BaseModel):
    """
    Data model for KDBX groups.
    """
    name: str = Field(..., min_length=1)
    icon: Optional[int] = None
    color: Optional[str] = None

    @classmethod
    def from_pykeepass(cls, kp_group: Group) -> "GroupModel":
        """
        Create a GroupModel instance from a pykeepass Group object.

        :param kp_group: The native pykeepass Group instance.
        :type kp_group: Group
        :return: A validated GroupModel instance.
        :rtype: GroupModel
        """
        custom = kp_group.custom_properties
        return cls(
            name=kp_group.name,
            icon=kp_group.icon,
            color=custom.get("color")
        )