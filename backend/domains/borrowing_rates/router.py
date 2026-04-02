from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlmodel import Session
from core.database import get_session
from .service import BorrowingRatesService
from .repository import BorrowingRatesRepository
from .schemas import DataPoint, IngestResponse

router = APIRouter(prefix="/borrowing-rates", tags=["borrowing_rates"])


@router.post("/ingest", response_model=IngestResponse)
def ingest_data(session: Session = Depends(get_session)):
    repository = BorrowingRatesRepository(session)
    service = BorrowingRatesService(repository)
    try:
        return service.ingest_data()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/data", response_model=List[DataPoint])
def get_data(session: Session = Depends(get_session)):
    repository = BorrowingRatesRepository(session)
    service = BorrowingRatesService(repository)
    try:
        return service.get_rates()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
