import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { fetchComments } from "@/lib/youtube";

const AnalysisSchema = z.object({
  sentiment: z.object({
    positive: z.number(),
    negative: z.number(),
    neutral: z.number(),
  }),
  keywords: z.array(z.object({
    text: z.string(),
    value: z.number(),
  })),
  summary: z.string(),
  stats: z.object({
    totalComments: z.number(),
    avgLength: z.number(),
  }),
  timeline: z.array(z.object({
    date: z.string(),
    count: z.number(),
    positive: z.number(),
    negative: z.number(),
    neutral: z.number(),
  })),
  bigrams: z.array(z.object({
    source: z.string(),
    target: z.string(),
    value: z.number(),
  })),
  recommendation: z.string().optional(),
});

export async function POST(req: Request) {
  console.log("Analysis started...");
  try {
    const { videoId } = await req.json();
    if (!videoId) return new Response(JSON.stringify({ error: "Missing videoId" }), { status: 400 });

    // 1. Fetch comments (Limit to 100 recent comments for speed)
    console.log("Fetching comments for video:", videoId);
    const comments = await fetchComments(videoId, 100);

    if (comments.length === 0) {
      return new Response(JSON.stringify({ error: "No comments found" }), { status: 404 });
    }

    const totalComments = comments.length;
    const avgLength = comments.reduce((sum, c) => sum + (c.text?.length || 0), 0) / totalComments;

    // Pre-group timeline by date (JS side is much faster)
    const timelineGroups: Record<string, number> = {};
    comments.forEach(c => {
      const date = c.publishedAt.split('T')[0];
      timelineGroups[date] = (timelineGroups[date] || 0) + 1;
    });
    const groupedTimeline = Object.entries(timelineGroups).map(([date, count]) => ({ date, count }));

    const commentTexts = comments.map(c => c.text).join("\n---\n");

    // 2. Analyze with Gemini
    console.log("Sending to Gemini...");
    const { object } = await generateObject({
      model: google("gemini-3.1-flash-lite"),
      schema: AnalysisSchema,
      prompt: `유튜브 영상(Video ID: ${videoId})의 최근 댓글들을 분석하여 아래 형식으로 응답하세요.
      **응답 본문의 모든 텍스트는 한국어로 작성해야 합니다.**
      
      [분석할 내용]
      1. 감정 분포: 전체 댓글 중 긍정, 부정, 중립 성향의 개수를 정확히 집계하세요.
      2. 주요 키워드: 핵심 주제를 나타내는 키워드 10개와 상호 중요도(value)를 추출하세요.
      3. 종합 요약: 전체 여론의 핵심 내용을 요약하여 작성하세요.
      4. 타임라인 감정 분석: 아래 날짜별 댓글 수 그룹을 참고하여, 각 날짜별 감정 분포를 추정 분석하세요.
         (날짜별 데이터: ${JSON.stringify(groupedTimeline)})
      5. 비그램(Bigram) 분석: 가장 빈번하게 함께 등장하는 단어 쌍(source, target) 20개를 추출하고 연관도(value)를 설정하세요. 핵심 키워드 사이의 연결을 중점적으로 보되, 관용구나 의미 있는 구문 위주로 작성하세요.
      6. 인사이트: 작성자들에게 필요한 조언이나 콘텐츠 추천을 포함하세요.
      
      [분석할 댓글 데이터]
      ${commentTexts.substring(0, 15000)} // Increased limit slightly
      `,
    });

    console.log("Analysis completed.");
    return new Response(JSON.stringify(object), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Detailed Analysis Error:", error);
    return new Response(JSON.stringify({ error: error.message || "서버 내부 오류가 발생했습니다." }), { status: 500 });
  }
}
