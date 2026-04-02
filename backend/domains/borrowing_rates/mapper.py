import logging
from datetime import date
from core.exceptions import ValidationError
from .constants import ECB_SERIES_DIMENSION_KEY, ECB_UNIT

logger = logging.getLogger(__name__)


def map_ecb_payload_to_records(payload: dict, series_key: str) -> list[dict]:
    try:
        observations = (
            payload["dataSets"][0]["series"][ECB_SERIES_DIMENSION_KEY]
            ["observations"]
        )
        time_periods = (
            payload["structure"]["dimensions"]["observation"][0]["values"]
        )
    except (KeyError, IndexError) as e:
        raise ValidationError(
            f"Invalid ECB payload structure: missing key {e}"
        ) from e

    records = []
    for index_str, obs_values in observations.items():
        value = obs_values[0]
        if value is None:
            continue

        try:
            period_id = time_periods[int(index_str)]["id"]
            year, month = map(int, period_id.split("-"))
            period = date(year, month, 1)
        except (ValueError, IndexError, KeyError) as e:
            logger.warning(
                "Skipping unparseable period at index %s: %s", index_str, e
            )
            continue

        records.append({
            "series_key": series_key,
            "period": period,
            "value": float(value),
            "unit": ECB_UNIT,
        })

    return records
