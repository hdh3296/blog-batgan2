import uuid
from typing import Any, Optional

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app.api.deps import SessionDep
from app.models import Post, PostCreate, PostPublic, PostsPublic, PostUpdate

router = APIRouter(prefix="/posts", tags=["posts"])


@router.get("/", response_model=PostsPublic)
def read_posts(
    session: SessionDep, skip: int = 0, limit: int = 100, published_only: bool = True
) -> Any:
    """
    Retrieve posts. No authentication required for public posts.
    """
    count_statement = select(func.count()).select_from(Post)
    statement = select(Post).offset(skip).limit(limit)
    
    if published_only:
        count_statement = count_statement.where(Post.published == True)
        statement = statement.where(Post.published == True)
    
    count = session.exec(count_statement).one()
    posts = session.exec(statement).all()
    
    return PostsPublic(items=posts, count=count)


@router.get("/{id}", response_model=PostPublic)
def read_post(session: SessionDep, id: uuid.UUID) -> Any:
    """
    Get post by ID. No authentication required for public posts.
    """
    post = session.get(Post, id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if not post.published:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.post("/", response_model=PostPublic)
def create_post(*, session: SessionDep, post_in: PostCreate) -> Any:
    """
    Create new post. This would normally require authentication.
    For demo purposes, we'll allow it without auth.
    """
    post = Post.model_validate(post_in)
    session.add(post)
    session.commit()
    session.refresh(post)
    return post


@router.put("/{id}", response_model=PostPublic)
def update_post(
    *, session: SessionDep, id: uuid.UUID, post_in: PostUpdate
) -> Any:
    """
    Update a post. This would normally require authentication.
    """
    post = session.get(Post, id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    update_dict = post_in.model_dump(exclude_unset=True)
    post.sqlmodel_update(update_dict)
    session.add(post)
    session.commit()
    session.refresh(post)
    return post


@router.delete("/{id}")
def delete_post(session: SessionDep, id: uuid.UUID) -> dict[str, str]:
    """
    Delete a post. This would normally require authentication.
    """
    post = session.get(Post, id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    session.delete(post)
    session.commit()
    return {"message": "Post deleted successfully"}