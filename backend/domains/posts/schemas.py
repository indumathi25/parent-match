from typing import List, Optional
from datetime import datetime
import uuid
from pydantic import BaseModel
from sqlmodel import SQLModel
from .models import PostBase, CommentBase

class CommentRead(CommentBase):
    id: uuid.UUID
    post_id: uuid.UUID
    created_at: datetime

class PostCreate(SQLModel):
    title: Optional[str] = None
    content: str
    category: str
    author_name: str

class PostRead(PostBase):
    id: uuid.UUID
    created_at: datetime
    comments: List[CommentRead] = []

class CommentCreate(CommentBase):
    pass
