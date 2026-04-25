# Youtube-Comment-AI-Analysis

### 빈 폴더 만들기

폴더 이름: 'youtube-comment'로 이름 수정

> 반드시 폴더명은 `소문자`로 작성

---
### 안티그래비티를 열고 폴더 오픈

---
### Next.js 기반 코드 베이스 구축

터미널을 열고

> npx create-next-app@latest .

---
### 코드 수정

- readme.md 파일 내용 삭제
- public 폴더에 있는 이미지 삭제
- app/layout.tsx 파일에서 title, description 수정

---
### 프런트 UI 추가 기능 설치

터미널을 열고

> npx shadcn@latest init

---
### clonecn skill 설치

터미널에서

> npx skills add hunvreus/clonecn --skill clonecn

* 참고: https://github.com/hunvreus/clonecn/blob/main/README.md

---
### AI 툴킷 설치

터미널에서

> npm install ai @ai-sdk/react @ai-sdk/google zod

---
### YouTube Data API 키 받기

브라우저에서

> https://console.cloud.google.com/apis 에 접속

---
### YouTube Data API 키 저장하기

- .env.local 파일 만들기
- 복사한 API 키값을 `YOUTUBE_API_KEY=` 에 연결

---
### Gemini API 키 받기

- Google AI Studio에서 발급받은 Gemini API 키를 .env.local 파일에 저장

---





