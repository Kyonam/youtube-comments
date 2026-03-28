export function extractVideoId(url: string) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}

export interface YouTubeComment {
  id: string;
  text: string;
  author: string;
  publishedAt: string;
  likeCount: number;
}

export async function fetchComments(videoId: string, maxResults = 100): Promise<YouTubeComment[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YOUTUBE_API_KEY is not set");

  const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=${maxResults}&key=${apiKey}`;
  
  const response = await fetch(url);
  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.items.map((item: any) => ({
    id: item.id,
    text: item.snippet.topLevelComment.snippet.textDisplay,
    author: item.snippet.topLevelComment.snippet.authorDisplayName,
    publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
    likeCount: item.snippet.topLevelComment.snippet.likeCount,
  }));
}
