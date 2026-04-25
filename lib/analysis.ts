import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export interface CommentAnalysis {
  id: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  keywords: string[];
  bigrams: string[][];
  publishedAt: string;
  textLength: number;
}

const analysisSchema = z.object({
  analyses: z.array(z.object({
    id: z.string(),
    sentiment: z.enum(['positive', 'negative', 'neutral']),
    keywords: z.array(z.string()),
    bigrams: z.array(z.array(z.string())),
    publishedAt: z.string(),
    textLength: z.number(),
  }))
});

export async function analyzeComments(comments: any[]) {
  // We'll analyze in batches to avoid token limits and stay within rate limits
  const batchSize = 25;
  const batches = [];
  for (let i = 0; i < comments.length; i += batchSize) {
    batches.push(comments.slice(i, i + batchSize));
  }

  const results: CommentAnalysis[] = [];

  for (const batch of batches) {
    const prompt = `Analyze the following YouTube comments. For each comment, provide:
1. Sentiment: positive, negative, or neutral.
2. Keywords: top 3 important words.
3. Bigrams: up to 5 meaningful word pairs that appear together (e.g., ["좋은", "영상"], ["진짜", "최고"]).
4. The provided id, publishedAt, and textLength.

Return the results as a JSON object with an "analyses" array.

Comments:
${batch.map(c => `ID: ${c.id}, Date: ${c.publishedAt}, Text: ${c.text}`).join('\n\n')}
`;

    const { object } = await generateObject({
      model: google('gemini-3.1-flash-lite-preview'),
      schema: analysisSchema,
      prompt: prompt,
    });

    results.push(...(object.analyses as CommentAnalysis[]));
  }

  return results;
}

export async function generateSummary(analyses: CommentAnalysis[]) {
  const sentimentCounts = analyses.reduce((acc: any, curr) => {
    acc[curr.sentiment] = (acc[curr.sentiment] || 0) + 1;
    return acc;
  }, {});

  const allKeywords = analyses.flatMap(a => a.keywords);
  const keywordFreq: any = {};
  allKeywords.forEach(k => { keywordFreq[k] = (keywordFreq[k] || 0) + 1; });
  const topKeywords = Object.entries(keywordFreq)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 15)
    .map(([name]) => name);

  const prompt = `당신은 전문 유튜브 데이터 분석가입니다. 다음의 댓글 분석 데이터를 바탕으로, 시청자들의 반응을 심층적으로 분석하여 한국어로 요약 리포트를 작성하세요.

[데이터 통계]
- 전체 분석 댓글 수: ${analyses.length}개
- 감정 분포: 긍정 ${sentimentCounts.positive || 0}개, 부정 ${sentimentCounts.negative || 0}개, 중립 ${sentimentCounts.neutral || 0}개
- 핵심 키워드: ${topKeywords.join(', ')}

[요구사항]
1. 시청자들의 전반적인 분위기와 감정의 원인을 구체적으로 분석하세요.
2. 가장 많이 언급된 키워드들이 어떤 맥락에서 쓰였는지 추론하여 설명하세요.
3. 영상 제작자에게 도움이 될 만한 인사이트나 제언을 포함하세요.
4. 전문적이고 분석적인 톤앤매너를 유지하며 3-4문장으로 작성하세요.
5. 마크다운 형식을 사용하지 말고 순수 텍스트로만 답변하세요.`;

  const { object } = await generateObject({
    model: google('gemini-3.1-flash-lite-preview'),
    schema: z.object({ summary: z.string() }),
    prompt: prompt,
  });

  return object.summary;
}
