import logging
import httpx
from datetime import date
from .repository import BorrowingRatesRepository
from .utils import handle_service_exceptions
from .mapper import map_ecb_payload_to_records
from core.config import config

logger = logging.getLogger(__name__)


class BorrowingRatesService:

    def __init__(self, repository: BorrowingRatesRepository):
        self.repository = repository

    @handle_service_exceptions(logger, "Failed to fetch and ingest ECB data")
    def ingest_data(self) -> dict:
        logger.info("Fetching ECB data from %s", config.ECB_API_URL)

        try:
            with httpx.Client(timeout=30) as client:
                response = client.get(config.ECB_API_URL)
                response.raise_for_status()
                payload = response.json()
        except httpx.HTTPError as e:
            logger.error(f"Failed to fetch from ECB API: {e}")
            raise

        records = map_ecb_payload_to_records(payload, config.SERIES_KEY)

        if not records:
            logger.warning("ECB payload parsed but yielded zero records.")
            return {"status": "success", "inserted_rows": 0, "total_records": 0}

        try:
            rowcount = self.repository.upsert_records(records)
            logger.info("Ingest complete: %d records processed.", len(records))
            return {
                "status": "success",
                "inserted_rows": rowcount,
                "total_records": len(records),
            }
        except Exception as e:
            logger.error(f"Failed to upsert records: {e}")
            raise

    @handle_service_exceptions(logger, "Failed to retrieve borrowing rates")
    def get_rates(self) -> list[dict]:
        """Get all borrowing rates from database."""
        logger.info("Retrieving rates from database")
        return self.repository.get_all_records()

