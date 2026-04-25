# 유튜브 댓글 AI 분석 서비스 (YouTube Comment Insights)

유튜브 영상의 URL을 입력하면 실시간으로 댓글을 수집하고, Google Gemini AI를 활용하여 감정 분석, 키워드 추출, 그리고 단어 연관성 네트워크 시각화를 제공하는 프리미엄 대시보드 서비스입니다.

## 주요 기능

1. **감정 분석 (Sentiment Analysis)**:
   - 각 댓글의 긍정, 부정, 중립 상태를 Gemini 3.1 Flash-Lite 모델로 정확하게 분석합니다.
   - 분석된 감정 분포를 세련된 도넛 차트로 시각화합니다.

2. **키워드 및 단어 연관성 (Keywords & Network)**:
   - 고빈도 키워드를 가로 바 차트로 보여줍니다.
   - 빅램(Bigram) 분석을 통해 단어 간의 연관 관계를 2D 네트워크 그래프로 시각화합니다.

3. **시간대별 분석 (Time-series)**:
   - 댓글 작성 시간대를 분석하여 시간 흐름에 따른 감정 변화와 활동량을 영역 차트로 보여줍니다.

4. **AI 종합 리포트**:
   - 전체 분석 결과를 바탕으로 AI가 시청자들의 주요 반응과 인사이트를 전문적인 톤으로 요약해줍니다.

5. **프리미엄 UI/UX**:
   - Outfit 폰트와 현대적인 컬러 팔레트 적용.
   - Framer Motion을 활용한 부드러운 전환 효과와 로딩 애니메이션.

## 기술 스택

- **Framework**: Next.js 16.2 (App Router)
- **AI Engine**: Google Gemini 3.1 Flash-Lite
- **UI/Styling**: Tailwind CSS, Framer Motion, Lucide React
- **Visualization**: Recharts, React Force Graph
- **API**: AI SDK (Vercel), YouTube Data API v3

## 시작하기

### 환경 변수 설정
`.env.local` 파일을 생성하고 다음 정보를 입력하세요:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
YOUTUBE_API_KEY=your_youtube_api_key
```

### 설치 및 실행
```bash
npm install
npm run dev
```

---

### 유튜브 영상 댓글 AI 분석 서비스 제작

프롬프트:

```
- 유튜브 댓글 수집: YouTube API를 통해 유튜브 URL 또는 비디오 ID로 댓글 가져오기
- Gemini 모델: gemini-3.1-flash-lite-preview
- 댓글 분석: Gemini API를 사용한 감정 분석(긍정/부정/중립) 및 키워드 추출
- 시각화:
	○ 감정 분포 파이 차트
	○ 시간대별 긍정,부정,중립 댓글 수
	○ 시간대별 댓글 수 라인 차트
	○ 댓글 통계 카드(총 댓글 수, 평균 길이 등)
	○ bigram 단어 쌍을 분석하고 네트워크 시각화로 나타내기
	○ 시각화는 모두 인터렉티브하게 구현
- UI: 밝은 톤의 모던한 디자인
- 에러처리 및 로딩상태 관리
	○ 분석이 진행 중일 때 화면에 로딩 효과 구현
```

- `ref_img.png` 를 디자인 시스템처럼 참고

---
### 코드 최적화

터미널에서

> npm run build

---
### 깃허브 연동 및 코드베이스 업로드

- 깃허브에 접속해서 저장소 생성

프롬프트:

> 현재 연결된 깃허브 정보를 알려줘

깃허브 정보를 확인 후:

> https://github.com/Kyonam/youtube-comments.git 이 곳에 코드 베이스를 업로드해줘

---
# Vercel 배포
