from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
import uuid

from core.database import get_session
from core.auth import get_current_user, TokenPayload
from .models import Post, Comment
from .schemas import PostCreate, PostRead, CommentCreate, CommentRead

router = APIRouter(prefix="/posts", tags=["Posts"])

@router.get("/", response_model=List[PostRead])
def get_posts(session: Session = Depends(get_session), skip: int = 0, limit: int = 100):
    posts = session.exec(select(Post).order_by(Post.created_at.desc()).offset(skip).limit(limit)).all()
    return posts

@router.post("/", response_model=PostRead, status_code=status.HTTP_201_CREATED)
def create_post(
    post_in: PostCreate, 
    session: Session = Depends(get_session),
    current_user: TokenPayload = Depends(get_current_user)
):
    db_post = Post.model_validate(post_in)
    if current_user.name:
        db_post.author_name = current_user.name
    session.add(db_post)
    session.commit()
    session.refresh(db_post)
    return db_post

@router.post("/{post_id}/comments", response_model=CommentRead, status_code=status.HTTP_201_CREATED)
def create_comment(
    post_id: uuid.UUID, 
    comment_in: CommentCreate, 
    session: Session = Depends(get_session),
    current_user: TokenPayload = Depends(get_current_user)
):
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    db_comment = Comment.model_validate(comment_in, update={"post_id": post_id})
    if current_user.name:
        db_comment.author_name = current_user.name
    session.add(db_comment)
    session.commit()
    session.refresh(db_comment)
    return db_comment
