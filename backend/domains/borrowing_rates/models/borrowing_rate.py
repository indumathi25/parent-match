from datetime import date
from sqlmodel import SQLModel, Field, Index


class BorrowingRate(SQLModel, table=True):
    __tablename__ = "borrowing_rates"

    series_key: str = Field(primary_key=True)
    period: date = Field(primary_key=True)
    value: float
    unit: str | None = None

    __table_args__ = (
        Index("idx_period", "period"),
        Index("idx_series_period", "series_key", "period"),
    )
