from typing import List, Optional
from datetime import datetime, timezone
import uuid
from sqlmodel import Field, SQLModel, Relationship

class PostBase(SQLModel):
    title: Optional[str] = Field(default=None, max_length=255)
    content: str
    category: str = Field(index=True)
    author_name: str = Field(index=True)
    auth0_sub: Optional[str] = Field(default=None, index=True)

class Post(PostBase, table=True):
    __tablename__ = "posts"
    
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False,
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    comments: List["Comment"] = Relationship(back_populates="post", sa_relationship_kwargs={"cascade": "all, delete"})

class CommentBase(SQLModel):
    content: str
    author_name: str

class Comment(CommentBase, table=True):
    __tablename__ = "comments"
    
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False,
    )
    post_id: uuid.UUID = Field(foreign_key="posts.id", nullable=False)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    
    post: Post = Relationship(back_populates="comments")
