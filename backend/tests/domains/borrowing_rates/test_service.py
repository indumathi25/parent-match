import pytest
from domains.borrowing_rates.service import BorrowingRatesService


@pytest.fixture
def service(mock_repository):
    return BorrowingRatesService(mock_repository)


def test_ingest_data_success(mocker, service, mock_repository):
    mock_response = mocker.Mock()
    mock_response.json.return_value = {
        "dataSets": [
            {
                "series": {
                    "0:0:0:0:0:0:0:0:0:0": {
                        "observations": {"0": [2.5, "normal"]}
                    }
                }
            }
        ],
        "structure": {
            "dimensions": {
                "observation": [{"values": [{"id": "2023-01"}]}]
            }
        },
    }
    mock_response.raise_for_status = mocker.Mock()

    mock_client = mocker.patch("httpx.Client")
    mock_client_instance = mock_client.return_value.__enter__.return_value
    mock_client_instance.get.return_value = mock_response

    mock_repository.upsert_records.return_value = 1

    result = service.ingest_data()

    assert result["status"] == "success"
    assert result["inserted_rows"] == 1
    assert result["total_records"] == 1
    mock_repository.upsert_records.assert_called_once()


def test_ingest_data_no_records(mocker, service, mock_repository):
    mock_response = mocker.Mock()
    mock_response.json.return_value = {
        "dataSets": [],
        "structure": {"dimensions": {"observation": []}},
    }
    mock_response.raise_for_status = mocker.Mock()

    mock_client = mocker.patch("httpx.Client")
    mock_client_instance = mock_client.return_value.__enter__.return_value
    mock_client_instance.get.return_value = mock_response

    mocker.patch(
        "domains.borrowing_rates.service.map_ecb_payload_to_records",
        return_value=[],
    )

    result = service.ingest_data()

    assert result["status"] == "success"
    assert result["inserted_rows"] == 0
    assert result["total_records"] == 0
    mock_repository.upsert_records.assert_not_called()


def test_get_rates(service, mock_repository):
    mock_repository.get_all_records.return_value = [
        {"period": "2023-01", "value": 2.5}
    ]

    result = service.get_rates()

    assert len(result) == 1
    assert result[0]["value"] == 2.5
    mock_repository.get_all_records.assert_called_once()
