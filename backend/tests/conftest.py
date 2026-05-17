import pytest
from fastapi.testclient import TestClient
from main import app


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def mock_db(mocker):
    return mocker.patch('core.extensions.db.session')

