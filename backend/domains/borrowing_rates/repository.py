import logging
from sqlmodel import Session, select
from sqlalchemy.dialects.postgresql import insert as pg_insert

from .models.borrowing_rate import BorrowingRate
from core.config import config
from core.exceptions import DatabaseError
from domains.borrowing_rates.utils import chunk_list

logger = logging.getLogger(__name__)


class BorrowingRatesRepository:

    def __init__(self, session: Session):
        self.session = session

    def upsert_records(self, records: list[dict]) -> int:
        if not records:
            logger.warning("upsert_records called with empty list, skipping.")
            return 0
 
        try:
            chunks = chunk_list(records, config.DB_CHUNK_SIZE)
 
            for chunk in chunks:
                stmt = (
                    pg_insert(BorrowingRate)
                    .values(chunk)
                    .on_conflict_do_update(
                        index_elements=[
                            BorrowingRate.series_key,
                            BorrowingRate.period,
                        ],
                        set_={"value": pg_insert(BorrowingRate).excluded.value},
                    )
                )
                self.session.exec(stmt)
 
            self.session.commit()
            logger.info("Upserted %d records in batches.", len(records))
            return len(records)
        except Exception as e:
            self.session.rollback()
            logger.error(f"Database error during upsert_records: {e}")
            raise DatabaseError(f"Upsert operation failed: {str(e)}") from e

    def get_all_records(self) -> list[dict]:
        try:
            statement = (
                select(BorrowingRate)
                .where(BorrowingRate.series_key == config.SERIES_KEY)
                .order_by(BorrowingRate.period.asc())
            )
            results = self.session.exec(statement).all()
            logger.info(
                "Fetched %d records for series '%s'.",
                len(results),
                config.SERIES_KEY,
            )
            return [row.model_dump() for row in results]
        except Exception as e:
            self.session.rollback()
            logger.error(f"Database error during get_all_records: {e}")
            raise DatabaseError(f"Fetch operation failed: {str(e)}") from e
