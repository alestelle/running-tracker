# 🏃 Running Tracker

Strava 연동 개인 러닝 기록 대시보드. 나의 모든 러닝 데이터를 한눈에 확인할 수 있습니다.

**🔗 [running-tracker-ten.vercel.app](https://running-tracker-ten.vercel.app)**

---

## 주요 기능

| 화면 | 내용 |
|------|------|
| **대시보드** | 이번 주 · 이번 달 · 전체 통계 요약 |
| **러닝 목록** | 전체 기록 목록, 거리 · 페이스 · 시간 표시 |
| **러닝 상세** | 경로 지도, 페이스 구간 분석 |
| **캘린더** | 월별 달력 — 날짜별 거리 + 평균 페이스 표시 |
| **차트** | 주간 · 월간(최대 60개월) · 누적 거리, 페이스 추이 |

---

## 기술 스택

- **Framework** — [Next.js 15](https://nextjs.org) (App Router)
- **Language** — TypeScript
- **Styling** — Tailwind CSS
- **Charts** — [Recharts](https://recharts.org)
- **Map** — [Leaflet](https://leafletjs.com) + OpenStreetMap
- **Auth** — Strava OAuth 2.0 (커스텀 구현)
- **Deploy** — [Vercel](https://vercel.com)
- **Data** — [Strava API v3](https://developers.strava.com)

---

## 로컬 실행

### 1. 저장소 클론

```bash
git clone https://github.com/alestelle/running-tracker.git
cd running-tracker
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 아래 값을 입력합니다.

```env
STRAVA_CLIENT_ID=your_client_id
STRAVA_CLIENT_SECRET=your_client_secret
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=http://localhost:3000
```

Strava API 키는 [strava.com/settings/api](https://www.strava.com/settings/api)에서 발급받을 수 있습니다.
`Authorization Callback Domain`을 `localhost`로 설정하세요.

### 3. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인합니다.

---

## 프로젝트 구조

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # Strava OAuth 콜백 · 로그인 · 로그아웃
│   │   └── strava/        # 활동 목록 · 상세 API 라우트
│   └── dashboard/
│       ├── calendar/      # 캘린더 뷰
│       ├── charts/        # 차트 뷰
│       ├── runs/          # 러닝 목록 · 상세
│       └── page.tsx       # 대시보드 홈
├── components/
│   ├── calendar/          # CalendarGrid
│   ├── charts/            # 주간 · 월간 · 누적 · 페이스 차트
│   ├── map/               # Leaflet 경로 지도
│   ├── nav/               # Sidebar
│   └── runs/              # RunCard · PaceAnalysis
├── lib/
│   ├── format.ts          # 거리 · 페이스 · 시간 포맷 유틸
│   ├── session.ts         # 세션 관리 (쿠키 기반)
│   └── strava.ts          # Strava API 래퍼
└── types/
    └── strava.ts          # Strava 활동 타입 정의
```

---

## Vercel 배포

1. [Vercel](https://vercel.com)에서 이 저장소를 Import합니다.
2. Environment Variables에 위의 환경 변수 4개를 추가합니다.
   (`NEXTAUTH_URL`은 `https://your-domain.vercel.app`으로 설정)
3. Strava API 설정의 `Authorization Callback Domain`을 배포 도메인으로 변경합니다.
