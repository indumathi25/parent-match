from typing import List, Optional
from datetime import datetime
import uuid
from pydantic import BaseModel
from .models import PostBase, CommentBase

class CommentRead(CommentBase):
    id: uuid.UUID
    post_id: uuid.UUID
    created_at: datetime

class PostCreate(PostBase):
    pass

class PostRead(PostBase):
    id: uuid.UUID
    created_at: datetime
    comments: List[CommentRead] = []

class CommentCreate(CommentBase):
    pass
