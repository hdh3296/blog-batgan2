from sqlmodel import create_engine, SQLModel, Session
from app.core.config import settings
from app.models import Post, PostCreate
import uuid
from datetime import datetime

# Create engine
engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))

# Create all tables
SQLModel.metadata.create_all(engine)

# Create test posts
test_posts = [
    {
        "title": "FastAPI와 함께하는 백엔드 개발",
        "content": "FastAPI는 현대적이고 빠른 웹 API를 구축하기 위한 파이썬 웹 프레임워크입니다. 타입 힌트를 활용하여 자동으로 API 문서를 생성하고, 높은 성능을 제공합니다.",
        "author": "김개발",
        "published": True
    },
    {
        "title": "Vanilla JavaScript로 프론트엔드 구축하기",
        "content": "프레임워크 없이 순수 JavaScript만으로도 충분히 강력한 웹 애플리케이션을 만들 수 있습니다. 이 글에서는 Vanilla JS를 사용한 모던 웹 개발 방법을 소개합니다.",
        "author": "이프론트",
        "published": True
    },
    {
        "title": "Docker와 Docker Compose 활용하기",
        "content": "컨테이너 기술을 활용하면 개발 환경을 쉽게 구성하고 배포할 수 있습니다. Docker와 Docker Compose를 사용하여 개발 환경을 구축하는 방법을 알아봅시다.",
        "author": "박도커",
        "published": True
    },
    {
        "title": "PostgreSQL 데이터베이스 최적화",
        "content": "PostgreSQL은 강력한 오픈소스 관계형 데이터베이스입니다. 인덱스 최적화, 쿼리 튜닝, 파티셔닝 등 다양한 최적화 기법을 소개합니다.",
        "author": "최디비",
        "published": True
    },
    {
        "title": "테스트 주도 개발(TDD) 실천하기",
        "content": "TDD는 테스트를 먼저 작성하고 그 테스트를 통과하는 코드를 작성하는 개발 방법론입니다. 코드 품질을 높이고 버그를 줄이는 효과적인 방법입니다.",
        "author": "정테스트",
        "published": True
    }
]

# Insert test data
with Session(engine) as session:
    for post_data in test_posts:
        post = Post(**post_data)
        session.add(post)
    
    session.commit()
    print(f"Created {len(test_posts)} test posts successfully!")

print("Posts table created and test data inserted!")