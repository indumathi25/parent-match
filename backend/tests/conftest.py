import pytest
from fastapi.testclient import TestClient
from main import app


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def mock_db(mocker):
    return mocker.patch('core.extensions.db.session')


@pytest.fixture
def mock_repository(mocker):
    from domains.borrowing_rates.repository import BorrowingRatesRepository
    return mocker.Mock(spec=BorrowingRatesRepository)
