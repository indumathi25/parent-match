from pydantic import BaseModel
from datetime import date


class DataPoint(BaseModel):
    period: date
    value: float
    unit: str


class IngestResponse(BaseModel):
    status: str
    inserted_rows: int
    total_records: int
