import { NextResponse } from 'next/server';
import { fetchComments, extractVideoId } from '@/lib/youtube';
import { analyzeComments, generateSummary } from '@/lib/analysis';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    const videoId = extractVideoId(url);

    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL or Video ID' }, { status: 400 });
    }

    const rawComments = await fetchComments(videoId);
    
    if (rawComments.length === 0) {
      return NextResponse.json({ error: 'No comments found for this video' }, { status: 404 });
    }

    const commentsForAnalysis = rawComments.map(c => ({
      id: c.id,
      text: c.text,
      publishedAt: c.publishedAt,
      textLength: c.text.length
    }));

    const analysisResults = await analyzeComments(commentsForAnalysis);
    const summary = await generateSummary(analysisResults);

    return NextResponse.json({
      videoId,
      stats: {
        totalComments: rawComments.length,
        avgLength: Math.round(rawComments.reduce((acc, c) => acc + c.text.length, 0) / rawComments.length),
      },
      analysis: analysisResults,
      summary,
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'An error occurred during analysis' }, { status: 500 });
  }
}
