import time
import logging
from typing import Optional, Tuple, Union
from pathlib import Path
from io import BytesIO

import pyotp
from pyzbar.pyzbar import decode
from PIL import Image
from urllib.parse import urlparse, parse_qs

from app.core.config import settings
from app.controllers.kdbx.operations import get_active_vault, update_entry
from app.controllers.kdbx.models import EntryModel


logger = logging.getLogger(settings.PROJECT_NAME)


def get_otp_data(seed: str) -> Tuple[str, int]:
    """
    Generate the current 6-digit TOTP code and calculate the remaining time.

    :param seed: The secret TOTP seed (base32 string).
    :type seed: str
    :return: A tuple containing (6-digit_code, seconds_remaining).
    :rtype: Tuple[str, int]
    """
    try:
        totp = pyotp.TOTP(seed)
        code = totp.now()
        time_remaining = 30 - (int(time.time()) % 30)
        return code, time_remaining
    except Exception as e:
        logger.error(f"Error generating OTP: {e}")
        return "000000", 0


def extract_seed_from_qr(source: Union[str, Path, bytes]) -> Optional[str]:
    """
    Extract the TOTP secret from a QR code image.
    Supports file paths or raw bytes.

    :param source: Path to the image file or the raw bytes of the image.
    :return: The extracted base32 secret, or None if not found.
    """
    try:
        if isinstance(source, (str, Path)):
            img = Image.open(source)
        else:
            img = Image.open(BytesIO(source))

        decoded_objects = decode(img)
        if not decoded_objects:
            logger.warning("No QR code found in the provided image.")
            return None

        otp_url = decoded_objects[0].data.decode('utf-8')
        parsed_url = urlparse(otp_url)
        
        if parsed_url.scheme != 'otpauth':
            logger.error("Invalid QR content: Not an otpauth scheme.")
            return None

        params = parse_qs(parsed_url.query)
        secret = params.get('secret', [None])[0]

        return secret

    except Exception as e:
        logger.error(f"Error extracting seed from QR: {e}")
        return None


def register_otp_in_entry(entry_uuid: str, raw_data: Union[str, Path, bytes]) -> bool:
    """
    Update an existing entry with a TOTP seed.
    Detects automatically if the input is a plain text seed or a QR code.

    :param entry_uuid: The UUID of the entry to update.
    :param raw_data: The plain text seed, a file path to a QR, or image bytes.
    :return: True if updated successfully, False otherwise.
    """
    vault = get_active_vault()
    if not vault:
        return False

    seed = None
    
    if isinstance(raw_data, bytes) or (isinstance(raw_data, (str, Path)) and Path(str(raw_data)).exists()):
        seed = extract_seed_from_qr(raw_data)
    
    if not seed and isinstance(raw_data, str):
        seed = raw_data.replace(" ", "").upper()
    
    if not seed:
        logger.error("Could not obtain a valid TOTP seed from the provided data.")
        return False

    kp_entry = vault.find_entries(uuid=entry_uuid, first=True)
    if not kp_entry:
        return False

    entry_data = EntryModel.from_pykeepass(kp_entry)
    entry_data.totp_seed = seed

    return update_entry(entry_uuid, entry_data)