# 당근 마켓 클론

이 프로젝트는 Next.js를 사용하여 구현한 당근 마켓의 클론 버전입니다.

## 주요 기능

1. 사용자 인증

   - 이메일/비밀번호 회원가입
   - GitHub OAuth 로그인
   - SMS 인증 (한국 전화번호)

2. 제품 관리

   - 제품 목록 보기
   - 제품 상세 정보 보기
   - 제품 업로드
   - 제품 수정/삭제 (소유자만)
   - 이미지 업로드 (Cloudflare Images)

3. 커뮤니티 기능

   - 게시글 작성/조회
   - 좋아요 기능
   - 조회수 트래킹
   - 댓글 시스템

4. UI/UX
   - 무한 스크롤
   - 모달 인터페이스
   - 로딩 상태 표시
   - 반응형 디자인

## 기술 스택

### Frontend

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- React Hook Form

### Backend

- Prisma (ORM)
- SQLite
- Iron Session (세션 관리)
- Zod (유효성 검사)

### 인증/인가

- bcrypt (비밀번호 암호화)
- GitHub OAuth
- SMS 인증

### 이미지 처리

- Cloudflare Images
- Next.js Image 최적화

## 주요 컴포넌트

1. ProductList: 제품 목록을 표시하고 무한 스크롤을 구현
2. EditForm: 제품 정보 수정 폼
3. TabBar: 앱 네비게이션
4. SocialLogin: 소셜 로그인 컴포넌트

## 데이터 모델

- User: 사용자 정보
- Product: 제품 정보
- Post: 커뮤니티 게시글
- Like: 좋아요 정보
- Comment: 댓글 정보

## 설치 및 실행

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
