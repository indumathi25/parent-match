import pytest
from datetime import date
from domains.borrowing_rates.mapper import map_ecb_payload_to_records
from core.exceptions import ValidationError


def test_map_ecb_payload_to_records_success():
    payload = {
        "dataSets": [{
            "series": {
                "0:0:0:0:0:0:0:0:0:0": {
                    "observations": {
                        "0": [2.5, "normal"],
                        "1": [2.6, "normal"]
                    }
                }
            }
        }],
        "structure": {
            "dimensions": {
                "observation": [{
                    "values": [
                        {"id": "2023-01"},
                        {"id": "2023-02"}
                    ]
                }]
            }
        }
    }

    records = map_ecb_payload_to_records(payload, "TEST_KEY")

    assert len(records) == 2
    assert records[0] == {
        "series_key": "TEST_KEY",
        "period": date(2023, 1, 1),
        "value": 2.5,
        "unit": "PCPA"
    }
    assert records[1] == {
        "series_key": "TEST_KEY",
        "period": date(2023, 2, 1),
        "value": 2.6,
        "unit": "PCPA"
    }


def test_map_ecb_payload_to_records_missing_values():
    payload = {
        "dataSets": [{
            "series": {
                "0:0:0:0:0:0:0:0:0:0": {
                    "observations": {
                        "0": [None]
                    }
                }
            }
        }],
        "structure": {
            "dimensions": {
                "observation": [{
                    "values": [
                        {"id": "2023-01"}
                    ]
                }]
            }
        }
    }
    records = map_ecb_payload_to_records(payload, "TEST_KEY")
    assert len(records) == 0


def test_map_ecb_payload_to_records_invalid_structure():
    with pytest.raises(ValidationError):
        map_ecb_payload_to_records({"dataSets": []}, "TEST_KEY")
