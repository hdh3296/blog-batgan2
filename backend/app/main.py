# import sentry_sdk
from fastapi import FastAPI, Request
from fastapi.routing import APIRoute
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.middleware.cors import CORSMiddleware

from app.api.main import api_router
from app.core.config import settings


def custom_generate_unique_id(route: APIRoute) -> str:
    if route.tags:
        return f"{route.tags[0]}-{route.name}"
    return route.name


# if settings.SENTRY_DSN and settings.ENVIRONMENT != "local":
#     sentry_sdk.init(dsn=str(settings.SENTRY_DSN), enable_tracing=True)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
)

# Set all CORS enabled origins
if settings.all_cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.all_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_STR)

# 정적 파일 및 템플릿 설정
import os

# 백엔드 디렉토리의 부모 경로를 기준으로 설정
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Dockerfile.droplet에서는 /app/frontend로 복사됨
if os.path.exists("/app/frontend"):
    # 프로덕션 환경
    static_dir = "/app/frontend/static"
    templates_dir = "/app/frontend/templates"
else:
    # 로컬 개발 환경
    static_dir = os.path.join(base_dir, "..", "frontend", "static")
    templates_dir = os.path.join(base_dir, "..", "frontend", "templates")

# 정적 파일 마운트
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

# 템플릿 설정 - 항상 초기화
templates = Jinja2Templates(directory=templates_dir)

# 웹페이지 라우터
@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse("index.html", {
        "request": request,
        "title": "My Blog"
    })

@app.get("/blog")
async def blog_list(request: Request):
    return templates.TemplateResponse("blog/list.html", {
        "request": request
    })

@app.get("/blog/{post_id}")
async def blog_detail(request: Request, post_id: str):
    return templates.TemplateResponse("blog/detail.html", {
        "request": request,
        "post_id": post_id
    })
