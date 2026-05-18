from datetime import datetime
from typing import Optional
import uuid
from sqlmodel import SQLModel


class UserRead(SQLModel):
    id: uuid.UUID
    auth0_sub: str
    name: Optional[str] = None
    email: Optional[str] = None
    created_at: datetime
