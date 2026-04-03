from datetime import date
from typing import Optional

from sqlalchemy import Index
from sqlmodel import Field, SQLModel


class BorrowingRate(SQLModel, table=True):
    __tablename__ = "borrowing_rates"

    series_key: str = Field(primary_key=True)
    period: date = Field(primary_key=True)
    value: float
    unit: Optional[str] = None
