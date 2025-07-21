# 배포 가이드

Blog Batgan 프로젝트의 배포 가이드입니다.

## 🚀 DigitalOcean 배포

### 사전 준비사항
- DigitalOcean 계정
- Docker Hub 계정 (선택사항)
- 도메인 (선택사항)

### 1. Droplet 생성
```bash
# DigitalOcean CLI 사용 (doctl)
doctl compute droplet create ubuntu-s-1vcpu-1gb-sgp1-01 \
  --region sgp1 \
  --image ubuntu-24-04-x64 \
  --size s-1vcpu-1gb \
  --ssh-keys <your-ssh-key-id>
```

### 2. 서버 초기 설정
```bash
# setup-server.sh 스크립트 실행
ssh root@<droplet-ip> 'bash -s' < deploy/setup-server.sh
```

### 3. 애플리케이션 배포
```bash
# 서버 접속
ssh root@<droplet-ip>

# 저장소 클론
cd /opt
git clone https://github.com/hdh3296/blog-batgan2.git
cd blog-batgan2

# 환경 변수 설정
cp .env.production.example .env.production
# 편집기로 .env.production 수정

# Docker 컨테이너 실행
docker-compose -f docker-compose.production.yml up -d
```

### 4. Nginx 설정
```bash
# Nginx 설정 복사
cp nginx/nginx.conf /etc/nginx/sites-available/blog-batgan2
ln -s /etc/nginx/sites-available/blog-batgan2 /etc/nginx/sites-enabled/

# Nginx 재시작
nginx -t && systemctl reload nginx
```

## 🔧 유지보수

### 로그 확인
```bash
# 모든 컨테이너 로그
docker-compose -f docker-compose.production.yml logs -f

# 특정 서비스 로그
docker-compose -f docker-compose.production.yml logs -f backend
```

### 백업
```bash
# 데이터베이스 백업
docker exec blog-batgan2-db-1 pg_dump -U postgres app > backup_$(date +%Y%m%d).sql

# 전체 볼륨 백업
docker run --rm -v blog-batgan2_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_data_$(date +%Y%m%d).tar.gz -C /data .
```

### 업데이트 배포
```bash
# 코드 업데이트
cd /opt/blog-batgan2
git pull origin main

# 컨테이너 재시작
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml up -d --build
```

## 🔒 보안 강화

### SSL/TLS 설정 (Let's Encrypt)
```bash
# Certbot 설치
apt install certbot python3-certbot-nginx

# 인증서 발급
certbot --nginx -d your-domain.com
```

### 방화벽 설정
```bash
# UFW 설정
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

## 📊 모니터링

### 헬스체크
- FastAPI 헬스체크: `http://your-domain/api/v1/utils/health-check/`
- Docker 헬스체크: `docker ps` 상태 확인

### 리소스 모니터링
```bash
# CPU/메모리 사용량
htop

# 디스크 사용량
df -h

# Docker 컨테이너 리소스
docker stats
```

## 🚨 문제 해결

### 일반적인 문제들

1. **502 Bad Gateway**
   - Docker 컨테이너 실행 상태 확인
   - Nginx 설정 확인
   - 포트 충돌 확인

2. **Database Connection Error**
   - PostgreSQL 컨테이너 상태 확인
   - 환경 변수 확인
   - 네트워크 연결 확인

3. **Static Files 404**
   - Nginx 설정에서 정적 파일 경로 확인
   - FastAPI 정적 파일 마운트 확인

### 복구 절차
```bash
# 전체 재시작
docker-compose -f docker-compose.production.yml down
docker system prune -f
docker-compose -f docker-compose.production.yml up -d --build

# 데이터베이스 복구
docker exec -i blog-batgan2-db-1 psql -U postgres app < backup.sql
```

## 📝 체크리스트

### 배포 전
- [ ] 환경 변수 설정 확인
- [ ] 데이터베이스 백업
- [ ] 테스트 환경에서 검증

### 배포 후
- [ ] 헬스체크 엔드포인트 확인
- [ ] 로그 모니터링
- [ ] 성능 테스트
- [ ] 보안 스캔