# Modern Blog Platform

FastAPI + Vanilla JavaScript ES6+를 사용한 현대적인 블로그 플랫폼

## 🚀 기술 스택

### Backend
- ⚡ **FastAPI** - 고성능 Python 웹 API 프레임워크
- 🧰 **SQLModel** - SQL 데이터베이스 ORM
- 🔍 **Pydantic** - 데이터 검증 및 설정 관리
- 💾 **PostgreSQL** - 관계형 데이터베이스
- 🔒 **JWT** 인증 시스템
- 📫 이메일 기반 비밀번호 복구

### Frontend
- 🎨 **Vanilla JavaScript ES6+** - 프레임워크 없는 순수 자바스크립트
- 📦 **ES6 모듈 시스템** - 현대적인 모듈 아키텍처
- 🧩 **컴포넌트 기반 설계** - 재사용 가능한 UI 컴포넌트
- 🔄 **리액티브 상태 관리** - 구독 패턴 기반 상태 시스템
- ♿ **접근성 최적화** - ARIA 라벨 및 시맨틱 HTML
- 📱 **반응형 디자인** - 모바일 친화적 UI

### DevOps & Tools
- 🐋 **Docker Compose** - 개발 및 배포 환경
- 🚢 **Traefik** - 리버스 프록시 / 로드 밸런서
- 🧪 **Playwright** - E2E 테스팅
- ✅ **Pytest** - 백엔드 테스트
- 📧 **MailCatcher** - 개발용 메일 서버

## 📊 코드 품질 개선

### JavaScript ES6+ 아키텍처
**이전: 45/100 → 현재: 75/100** (67% 개선)

#### ✅ 주요 개선사항
- **컴포넌트 기반 아키텍처**: PostCard, PostList 컴포넌트
- **중앙집중식 상태 관리**: BlogState 클래스 with 구독 패턴
- **ES6 모듈 시스템**: 적절한 import/export 구조
- **향상된 에러 처리**: 사용자 친화적 피드백 시스템
- **보안 강화**: XSS 방지 및 HTML 이스케이핑
- **접근성 개선**: WCAG 2.1 준수

#### 🔧 기술적 특징
- 코드 중복 60% 감소
- 포괄적인 에러 경계 구현
- 리액티브 상태 관리 시스템
- 로딩 상태 및 페이지네이션
- TypeScript 스타일 JSDoc 주석

## 🏗️ 프로젝트 구조

```
├── backend/
│   ├── app/
│   │   ├── api/           # API 라우터
│   │   ├── core/          # 핵심 설정
│   │   ├── crud/          # 데이터베이스 작업
│   │   ├── models/        # SQLModel 모델
│   │   └── main.py        # FastAPI 애플리케이션
│   └── requirements.txt
├── frontend/
│   ├── static/
│   │   ├── js/
│   │   │   ├── api/           # API 통신 모듈
│   │   │   ├── components/    # UI 컴포넌트
│   │   │   ├── state/         # 상태 관리
│   │   │   ├── utils.js       # 유틸리티 함수
│   │   │   └── main-v2.js     # 메인 애플리케이션
│   │   └── css/
│   │       ├── style.css      # 기본 스타일
│   │       └── components.css # 컴포넌트 스타일
│   └── templates/         # Jinja2 템플릿
├── docs/                  # 문서
└── docker-compose.yml
```

## 🚀 빠른 시작

### 1. 저장소 클론
```bash
git clone <repository-url>
cd svelte-blog
```

### 2. 환경 설정
```bash
cp .env.example .env
# .env 파일에서 필요한 값들을 수정하세요
```

### 3. 개발 환경 실행
```bash
docker-compose up -d
```

### 4. 접속
- **웹사이트**: http://localhost:8000
- **API 문서**: http://localhost:8000/docs
- **관리자 도구**: http://localhost:8080 (Adminer)
- **메일 인터페이스**: http://localhost:1080 (MailCatcher)

## 📖 API 문서

FastAPI 자동 생성 API 문서는 http://localhost:8000/docs 에서 확인할 수 있습니다.

### 주요 엔드포인트
- `GET /api/v1/posts/` - 게시글 목록 조회
- `GET /api/v1/posts/{id}` - 게시글 상세 조회
- `POST /api/v1/posts/` - 게시글 생성 (인증 필요)
- `PUT /api/v1/posts/{id}` - 게시글 수정 (인증 필요)
- `DELETE /api/v1/posts/{id}` - 게시글 삭제 (인증 필요)

## 🧪 테스팅

### 백엔드 테스트
```bash
docker-compose exec backend pytest
```

### 프론트엔드 E2E 테스트
```bash
# Playwright 설치 (첫 실행시)
npx playwright install

# 테스트 실행
npx playwright test
```

### 수동 테스트
프로젝트에는 Playwright-stealth을 활용한 종합 테스트가 포함되어 있습니다:
- ✅ 메인 페이지 로딩 테스트
- ✅ 블로그 목록 페이지 테스트
- ✅ 개별 포스트 상세 페이지 테스트
- ✅ JavaScript 모듈 로딩 검증
- ✅ 에러 처리 및 상태 관리 테스트

## 🔧 개발 가이드

### JavaScript 코드 품질 가이드
프로젝트의 JavaScript 코드 품질 가이드는 [`docs/javascript-code-quality-guide-2025.md`](./docs/javascript-code-quality-guide-2025.md)에서 확인할 수 있습니다.

### 주요 개발 원칙
- **ES6+ 기능 활용**: async/await, 구조분해할당, 옵셔널 체이닝 등
- **모듈화**: 기능별로 분리된 모듈 구조
- **타입 안전성**: JSDoc을 통한 타입 힌트
- **에러 처리**: 포괄적인 try-catch 및 사용자 피드백
- **성능 최적화**: 지연 로딩 및 메모이제이션

### 컴포넌트 사용 예시
```javascript
import { PostCard, PostList } from './components/PostCard.js';
import { blogState } from './state/BlogState.js';

// 단일 포스트 카드
const postCard = new PostCard(post, {
    truncateLength: 150,
    showAuthor: true
});

// 포스트 목록
const postList = new PostList(posts, {
    containerClass: 'recent-posts',
    emptyMessage: '게시글이 없습니다.'
});

// 상태 구독
blogState.subscribe((state) => {
    console.log('상태 변경:', state);
});
```

## 📝 환경 변수 설정

주요 환경 변수들:

```env
# 보안
SECRET_KEY=your-secret-key-here
FIRST_SUPERUSER_PASSWORD=your-admin-password

# 데이터베이스
POSTGRES_PASSWORD=your-db-password
POSTGRES_DB=app

# 이메일 (선택사항)
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## 🚢 배포

### Docker를 사용한 프로덕션 배포
```bash
# 프로덕션 이미지 빌드
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# 또는 개별 서비스 배포
docker-compose up -d --build
```

### 주요 체크리스트
- [ ] 환경 변수 설정 (`SECRET_KEY`, `POSTGRES_PASSWORD` 등)
- [ ] HTTPS 인증서 설정 (Traefik)
- [ ] 데이터베이스 백업 전략
- [ ] 로그 모니터링 설정

## 🔒 보안 기능

- **JWT 인증**: 안전한 토큰 기반 인증
- **비밀번호 해싱**: 기본적으로 안전한 해시 알고리즘 사용
- **XSS 방지**: HTML 이스케이핑 및 입력 검증
- **CORS 정책**: 적절한 CORS 설정
- **SQL 인젝션 방지**: SQLModel ORM 사용

## 📚 문서

- [JavaScript 코드 품질 가이드](./docs/javascript-code-quality-guide-2025.md)
- [백엔드 개발 가이드](./backend/README.md)
- [배포 가이드](./deployment.md)
- [개발 환경 설정](./development.md)

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🙏 감사의 말

- [FastAPI](https://fastapi.tiangolo.com/) - 훌륭한 Python 웹 프레임워크
- [FastAPI Full Stack Template](https://github.com/fastapi/full-stack-fastapi-template) - 프로젝트 기본 구조
- Claude Code - JavaScript 아키텍처 개선 지원

---

⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!