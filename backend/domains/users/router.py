from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from core.auth import TokenPayload, get_current_user
from core.database import get_session
from domains.posts.models import Post
from domains.posts.schemas import PostRead

from .models import User
from .schemas import UserRead

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/me", response_model=UserRead)
def upsert_user(
    session: Session = Depends(get_session),
    current_user: TokenPayload = Depends(get_current_user),
):
    user = session.exec(select(User).where(User.auth0_sub == current_user.sub)).first()
    if user:
        user.name = current_user.name
        user.email = current_user.email
        user.updated_at = datetime.now(timezone.utc)
    else:
        user = User(
            auth0_sub=current_user.sub,
            name=current_user.name,
            email=current_user.email,
        )
        session.add(user)
    session.commit()
    session.refresh(user)
    return user


@router.get("/me", response_model=UserRead)
def get_me(
    session: Session = Depends(get_session),
    current_user: TokenPayload = Depends(get_current_user),
):
    user = session.exec(select(User).where(User.auth0_sub == current_user.sub)).first()
    if not user:
        user = User(
            auth0_sub=current_user.sub,
            name=current_user.name,
            email=current_user.email,
        )
        session.add(user)
        session.commit()
        session.refresh(user)
    return user


@router.get("/me/posts", response_model=List[PostRead])
def get_my_posts(
    session: Session = Depends(get_session),
    current_user: TokenPayload = Depends(get_current_user),
):
    posts = session.exec(
        select(Post)
        .where(Post.auth0_sub == current_user.sub)
        .order_by(Post.created_at.desc())
    ).all()
    return posts
