import sys
import os
from sqlmodel import Session
from core.database import engine
from domains.borrowing_rates.repository import BorrowingRatesRepository
from domains.borrowing_rates.service import BorrowingRatesService

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def run_ingestion():
    with Session(engine) as session:
        repository = BorrowingRatesRepository(session)
        service = BorrowingRatesService(repository)

        try:
            result = service.ingest_data()
            print(f"Ingestion successful: {result}")
        except Exception as e:
            print(f"Ingestion failed: {e}")
            sys.exit(1)


if __name__ == "__main__":
    run_ingestion()
