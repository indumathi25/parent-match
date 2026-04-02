from main import app
from core.database import get_session


def get_mock_session():
    yield None


app.dependency_overrides[get_session] = get_mock_session


def test_get_data_empty(client, mocker):
    mocker.patch(
        "domains.borrowing_rates.service.BorrowingRatesService.get_rates",
        return_value=[],
    )
    response = client.get("/api/v1/borrowing-rates/data")
    assert response.status_code == 200
    assert response.json() == []


def test_get_data_with_records(client, mocker):
    records = [{"period": "2023-01-01", "value": 2.5, "unit": "PCPA"}]
    mocker.patch(
        "domains.borrowing_rates.service.BorrowingRatesService.get_rates",
        return_value=records,
    )
    response = client.get("/api/v1/borrowing-rates/data")
    assert response.status_code == 200
    assert response.json() == records


def test_ingest_data_endpoint(client, mocker):
    mocker.patch(
        "domains.borrowing_rates.service.BorrowingRatesService.ingest_data",
        return_value={
            "status": "success",
            "inserted_rows": 10,
            "total_records": 10,
        },
    )
    response = client.post("/api/v1/borrowing-rates/ingest")
    assert response.status_code == 200
    assert response.json()["status"] == "success"
