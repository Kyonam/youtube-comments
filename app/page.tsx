'use client';

import { useState, useMemo, useEffect } from 'react';
import { YoutubeIcon as Youtube, Search, BarChart3, TrendingUp, Users, MessageSquare, Loader2, Network, Brain, CheckCircle2, Play, ChevronRight, Globe, Github } from 'lucide-react';
import { format, parseISO, startOfHour } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import SentimentChart from '@/components/analysis/SentimentChart';
import TimeSeriesChart from '@/components/analysis/TimeSeriesChart';
import NetworkGraph from '@/components/analysis/NetworkGraph';
import KeywordChart from '@/components/analysis/KeywordChart';

export default function Home() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);

  // Simulate loading steps for the progress bar
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
      }, 5000);
      return () => clearInterval(interval);
    } else {
      setLoadingStep(0);
    }
  }, [isLoading]);

  const handleAnalyze = async () => {
    if (!url) return;
    setIsLoading(true);
    setError('');
    setData(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to analyze');
      
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const processedData = useMemo(() => {
    if (!data) return null;

    // Sentiment distribution
    const sentimentCounts = data.analysis.reduce((acc: any, curr: any) => {
      acc[curr.sentiment] = (acc[curr.sentiment] || 0) + 1;
      return acc;
    }, {});

    const pieData = [
      { name: '긍정', value: sentimentCounts.positive || 0, color: '#10b981' },
      { name: '부정', value: sentimentCounts.negative || 0, color: '#ef4444' },
      { name: '중립', value: sentimentCounts.neutral || 0, color: '#6b7280' },
    ];

    // Time series data
    const timeGroups: any = {};
    data.analysis.forEach((c: any) => {
      const hour = format(startOfHour(parseISO(c.publishedAt)), 'MM-dd HH:00');
      if (!timeGroups[hour]) {
        timeGroups[hour] = { time: hour, positive: 0, negative: 0, neutral: 0, total: 0 };
      }
      timeGroups[hour][c.sentiment]++;
      timeGroups[hour].total++;
    });

    const lineData = Object.values(timeGroups).sort((a: any, b: any) => a.time.localeCompare(b.time));

    // Bigrams for network
    const allBigrams = data.analysis.flatMap((c: any) => c.bigrams || []);

    // Aggregate keywords
    const keywordMap: any = {};
    data.analysis.forEach((c: any) => {
      c.keywords?.forEach((k: string) => {
        keywordMap[k] = (keywordMap[k] || 0) + 1;
      });
    });

    const topKeywords = Object.entries(keywordMap)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 15)
      .map(([name]) => name);

    return { pieData, lineData, allBigrams, topKeywords };
  }, [data]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faff] text-[#1e293b]">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Youtube className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">YoutubeComment<span className="text-primary">.ai</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Home</a>
            <a href="#" className="hover:text-primary transition-colors">Features</a>
            <a href="#" className="hover:text-primary transition-colors">Pricing</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full space-y-12">
        {/* Always visible Input Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center space-y-8 max-w-3xl mx-auto transition-all duration-700 ${data || isLoading ? 'pb-8' : 'pb-20'}`}
        >
          {!data && !isLoading && (
            <>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                AI 댓글 분석 서비스
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                유튜브 댓글의 <span className="gradient-text">숨은 의미</span>를<br />
                AI로 분석하세요
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                영상의 전반적인 감정 분포, 주요 키워드, 시간별 작성 추이까지<br />
                한 눈에 확인하고 인사이트를 얻으세요.
              </p>
            </>
          )}

          <div className="relative max-w-2xl mx-auto pt-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="유튜브 영상 URL 혹은 비디오 ID 입력"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-primary/20 bg-white shadow-xl shadow-primary/5 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-lg"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                />
              </div>
              <button
                onClick={handleAnalyze}
                disabled={isLoading || !url}
                className="px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                분석하기
              </button>
            </div>
            {error && (
              <p className="absolute -bottom-10 left-0 right-0 text-destructive text-sm font-medium">
                {error}
              </p>
            )}
          </div>

          {!data && !isLoading && (
            <div className="pt-20 opacity-40 grayscale flex flex-col items-center gap-4">
              <BarChart3 className="w-16 h-16" />
              <p className="text-sm font-medium">데이터를 분석하려면 영상 URL을 입력하세요</p>
            </div>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-10 space-y-12"
            >
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center animate-float border border-primary/10">
                  <Brain className="w-16 h-16 text-primary" />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary/20 rounded-full blur-md" />
              </div>

              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold italic tracking-tight">
                  Gemini AI 모델이 감정 맥락을 분석 중...
                </h2>
                <div className="w-full max-w-md mx-auto space-y-6">
                  <div className="h-3 bg-muted rounded-full overflow-hidden border">
                    <motion.div 
                      className="h-full gradient-primary"
                      initial={{ width: "0%" }}
                      animate={{ width: `${(loadingStep + 1) * 25}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    <span className={loadingStep >= 0 ? "text-primary" : ""}>데이터 추출</span>
                    <span className={loadingStep >= 1 ? "text-primary" : ""}>AI 맥락분석</span>
                    <span className={loadingStep >= 2 ? "text-primary" : ""}>인사이트 도출</span>
                    <span className={loadingStep >= 3 ? "text-primary" : ""}>완료 대기</span>
                  </div>
                </div>
              </div>

              <div className="bg-white px-6 py-3 rounded-full border shadow-sm flex items-center gap-3">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <span className="text-sm font-semibold text-muted-foreground">최대 30초 정도 소요될 수 있습니다.</span>
              </div>
            </motion.div>
          )}

          {data && processedData && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12 border-t pt-12"
            >
              {/* Results Hero - Optional or redundant now? Let's keep a small header */}
              <div className="text-center space-y-4 pb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                  <CheckCircle2 className="w-3 h-3" /> AI 분석 리포트
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ResultStatCard title="총 댓글 수" value={data.stats.totalComments} unit="" icon={<MessageSquare className="w-5 h-5 text-blue-500" />} />
                <ResultStatCard title="평균 댓글 길이" value={data.stats.avgLength} unit="자" icon={<TrendingUp className="w-5 h-5 text-purple-500" />} />
                <ResultStatCard title="긍정 비율" value={Math.round((processedData.pieData[0].value / data.stats.totalComments) * 100)} unit="%" icon={<Users className="w-5 h-5 text-emerald-500" />} />
                <ResultStatCard title="분석 상태" value="완료" unit="" icon={<CheckCircle2 className="w-5 h-5 text-orange-500" />} isStatus />
              </div>

              {/* Charts Row 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-[2rem] border shadow-sm space-y-6">
                  <div className="space-y-1">
                    <h3 className="font-bold text-xl">감정 분석 분포</h3>
                    <p className="text-sm text-muted-foreground">댓글 중의 전반적인 감정 흐름을 나타냅니다.</p>
                  </div>
                  <SentimentChart data={processedData.pieData} />
                </div>
                <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border shadow-sm space-y-6">
                  <div className="space-y-1">
                    <h3 className="font-bold text-xl">주요 키워드 분포</h3>
                    <p className="text-sm text-muted-foreground">가장 많이 언급된 상위 10개 키워드입니다.</p>
                  </div>
                  <KeywordChart keywords={processedData.topKeywords} />
                </div>
              </div>

              {/* Network Visualization */}
              <div className="bg-white p-8 rounded-[2rem] border shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-xl flex items-center gap-2">
                      <Network className="w-5 h-5 text-primary" /> 단어 연관 네트워크 (Bigram)
                    </h3>
                    <p className="text-sm text-muted-foreground">데이터 내 주요 단어들 간의 긴밀한 관계를 시각화합니다.</p>
                  </div>
                  <button className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 border rounded-lg px-3 py-1.5 bg-muted/30">
                    전체 보기 <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="h-[500px] rounded-2xl overflow-hidden border bg-slate-50/50 relative">
                   <NetworkGraph bigrams={processedData.allBigrams} />
                </div>
              </div>

              {/* Time Series */}
              <div className="bg-white p-8 rounded-[2rem] border shadow-sm space-y-6">
                <div className="space-y-1">
                  <h3 className="font-bold text-xl">시간별 감정 추이</h3>
                  <p className="text-sm text-muted-foreground">날짜별 긍정, 부정, 중립 댓글 수의 변화를 보여줍니다.</p>
                </div>
                <TimeSeriesChart data={processedData.lineData} />
              </div>

              {/* AI Summary */}
              <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10 space-y-6">
                <h3 className="font-bold text-xl flex items-center gap-2">
                  <Brain className="w-6 h-6 text-primary" /> AI 종합 리포트
                </h3>
                <div className="bg-white p-8 rounded-3xl shadow-sm border text-lg leading-relaxed text-slate-700">
                  {data.summary || "분석 결과를 종합하여 요약 정보를 생성하고 있습니다..."}
                </div>
                <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  <p>전체적으로 긍정적인 반응이 우세하며, 특히 기능의 편의성과 디자인에 대한 호평이 많습니다.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Youtube className="w-5 h-5 text-primary" />
              <span className="font-bold text-lg">YoutubeComment.ai</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2026 YoutubeComment.ai. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Cookie Settings</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ResultStatCard({ title, value, unit, icon, isStatus }: { title: string; value: any; unit: string; icon: any; isStatus?: boolean }) {
  return (
    <div className="bg-white p-6 rounded-3xl border shadow-sm space-y-4 hover:shadow-md transition-all group">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-muted-foreground">{title}</span>
        <div className="p-2 bg-muted rounded-xl group-hover:scale-110 transition-transform">{icon}</div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-3xl font-extrabold tracking-tight ${isStatus ? 'text-orange-500' : ''}`}>{value}</span>
        <span className="text-sm font-bold text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
}

