# 당근 마켓 클론

Next.js 14와 TypeScript를 사용하여 구현한 당근 마켓 클론 프로젝트입니다.

## 주요 기능

### 1. 사용자 인증

- 이메일/비밀번호 회원가입 및 로그인
- GitHub OAuth 소셜 로그인
- SMS 인증 (한국 전화번호)
- Iron Session 기반 세션 관리

### 2. 제품 관리

- 무한 스크롤 제품 목록
- 제품 상세 정보
- 제품 등록/수정/삭제
- Cloudflare Images 기반 이미지 업로드

### 3. 커뮤니티 (Life)

- 게시글 작성/조회
- 좋아요 기능
- 조회수 추적
- 댓글 시스템

## 기술 스택

### Frontend

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- React Hook Form

### Backend

- Next.js API Routes
- Prisma ORM
- SQLite
- Iron Session

### 유틸리티

- Zod (데이터 검증)
- bcrypt (비밀번호 암호화)
- Cloudflare Images (이미지 저장소)

## 설치 방법

```bash
npm install
npx prisma migrate dev
npm run dev
```

## 환경 변수 설정

```env
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
CLOUDFLARE_ID=
CLOUDFLARE_TOKEN=
COOKIE_PASSWORD=
```

## 프로젝트 구조
