from domains.borrowing_rates.repository import BorrowingRatesRepository


def test_upsert_records_empty(mocker):
    mock_session = mocker.Mock()
    repo = BorrowingRatesRepository(mock_session)
    result = repo.upsert_records([])
    assert result == 0


def test_upsert_records_with_data(mocker):
    mock_session = mocker.Mock()
    mock_session.execute.return_value = None
    mock_session.commit.return_value = None
    repo = BorrowingRatesRepository(mock_session)

    records = [
        {
            "series_key": "K",
            "period": "2023-01-01",
            "value": 1.0,
            "unit": "U",
        }
    ]
    result = repo.upsert_records(records)

    assert result == 1
    mock_session.execute.assert_called_once()
    mock_session.commit.assert_called_once()


def test_get_all_records_mock(mocker):
    mock_session = mocker.Mock()
    mock_result = mocker.Mock()
    mock_result.all.return_value = []
    mock_session.exec.return_value = mock_result

    repo = BorrowingRatesRepository(mock_session)
    result = repo.get_all_records()
    assert isinstance(result, list)
    mock_session.exec.assert_called_once()
