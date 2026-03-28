"use client"

import { useState } from "react"
import { Search, Loader2, PlayCircle, BarChart3, PieChart, TrendingUp, InfoIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { extractVideoId } from "@/lib/youtube"
import { SummaryCards } from "./SummaryCards"
import { SentimentChart } from "./SentimentChart"
import { TimelineChart } from "./TimelineChart"
import { KeywordAnalysis } from "./KeywordAnalysis"
import { BigramNetwork } from "./BigramNetwork"
import { LoadingState } from "./LoadingState"
import { motion, AnimatePresence } from "framer-motion"

export function Analyzer() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    const videoId = extractVideoId(url) || url

    if (!videoId || videoId.length !== 11) {
      setError("유효한 유튜브 영상 URL 혹은 ID를 입력해주세요.")
      return
    }

    setLoading(true)
    setError(null)
    setData(null)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId }),
      })

      const result = await response.json()
      if (result.error) throw new Error(result.error)
      setData(result)
    } catch (err: any) {
      setError(err.message || "분석 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-10 pb-20">
      <section className="text-center space-y-4 py-16 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-950 rounded-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            AI 댓글 분석 서비스
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            유튜브 댓글의 <span className="text-blue-600 dark:text-blue-400">숨은 의미</span>를 AI로 분석하세요
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
            영상의 전반적인 감정 분포, 주요 키워드, 시간별 작성 추이까지 한 눈에 확인하고 인사이트를 얻으세요.
          </p>

          <form onSubmit={handleAnalyze} className="max-w-xl mx-auto flex gap-3 px-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
              <Input
                placeholder="유튜브 영상 URL 혹은 비디오 ID 입력"
                className="pl-10 h-12 rounded-xl text-md border-slate-200 dark:border-slate-800 shadow-sm focus-visible:ring-blue-500 transition-all"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <Button 
              type="submit" 
              disabled={loading || !url} 
              className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 font-semibold transition-all shadow-md active:scale-95"
            >
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <PlayCircle className="mr-2 h-5 w-5" />}
              {loading ? "분석 중..." : "분석하기"}
            </Button>
          </form>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 mt-4 text-sm font-medium"
            >
              {error}
            </motion.p>
          )}
        </motion.div>
      </section>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingState />
          </motion.div>
        )}

        {data && !loading && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <SummaryCards stats={{ ...data.sentiment, ...data.stats }} />

            <div className="grid gap-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <SentimentChart data={data.sentiment} />
                <KeywordAnalysis keywords={data.keywords} />
              </div>
              <BigramNetwork bigrams={data.bigrams || []} />
              <TimelineChart data={data.timeline} />
            </div>

            <Card className="border-blue-100 dark:border-blue-900 overflow-hidden">
              <CardHeader className="bg-blue-50/50 dark:bg-blue-900/10">
                <CardTitle className="text-blue-800 dark:text-blue-300 flex items-center gap-2">
                  <InfoIcon className="h-5 w-5" />
                  AI 종합 분석 요약
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <blockquote className="border-l-4 border-blue-500 pl-6 py-2 italic text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
                  {data.summary}
                </blockquote>
                {data.recommendation && (
                  <div className="mt-6 flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 h-fit">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">인사이트 & 추천 사항</h4>
                      <p className="text-muted-foreground leading-relaxed">{data.recommendation}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {!data && !loading && (
        <div className="flex flex-col items-center justify-center py-24 text-center opacity-30 select-none grayscale contrast-125">
          <BarChart3 className="h-24 w-24 mb-6 stroke-1 text-slate-400" />
          <p className="text-xl font-medium tracking-tight text-slate-500">데이터를 분석하려면 영상 URL을 입력하세요</p>
        </div>
      )}
    </div>
  )
}
