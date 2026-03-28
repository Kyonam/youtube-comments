"use client"

import { useMemo, useRef, useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Share2, Maximize2, Minimize2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

// ForceGraph2D expects browser environment
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
})

interface Bigram {
  source: string
  target: string
  value: number
}

interface BigramNetworkProps {
  bigrams: Bigram[]
}

export function BigramNetwork({ bigrams }: BigramNetworkProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 })
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Process data for ForceGraph
  const graphData = useMemo(() => {
    const nodesMap = new Map()
    const links: any[] = []

    bigrams.forEach(({ source, target, value }) => {
      if (!nodesMap.has(source)) nodesMap.set(source, { id: source, group: 1 })
      if (!nodesMap.has(target)) nodesMap.set(target, { id: target, group: 2 })
      
      links.push({
        source,
        target,
        value,
      })
    })

    return {
      nodes: Array.from(nodesMap.values()),
      links,
    }
  }, [bigrams])

  const fgRef = useRef<any>(null)

  useEffect(() => {
    if (fgRef.current) {
      // Balance layout: enough distance to prevent overlaps but keep related nodes together
      fgRef.current.d3Force('link').distance(isFullscreen ? 120 : 80) 
      fgRef.current.d3Force('charge').strength(isFullscreen ? -400 : -300)
      fgRef.current.d3Force('center').strength(0.05)
      fgRef.current.d3Force('collide', (window as any).d3?.forceCollide(45))
    }
  }, [graphData, isFullscreen])

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: isFullscreen ? window.innerWidth * 0.9 : containerRef.current.offsetWidth - 32,
          height: isFullscreen ? window.innerHeight * 0.8 : 500,
        })
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isFullscreen])

  return (
    <>
      <Card className="border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm relative z-10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Share2 className="h-5 w-5 text-blue-500" />
              단어 연관 네트워크 (Bigram)
            </CardTitle>
            <CardDescription>
              댓글에서 자주 함께 등장하는 단어들의 관계를 시각화합니다.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(true)}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-500 hover:border-blue-200 transition-all shadow-sm"
          >
            <Maximize2 className="h-4 w-4" />
            크게 보기
          </Button>
        </CardHeader>
        <CardContent className="p-4 relative" ref={containerRef}>
          <div className="rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 shadow-inner">
            <ForceGraph2D
              ref={fgRef}
              graphData={graphData}
              width={dimensions.width}
              height={dimensions.height}
              nodeLabel="id"
              nodeRelSize={8}
              linkDirectionalArrowLength={6}
              linkDirectionalArrowRelPos={1}
              linkDirectionalParticles={4}
              linkDirectionalParticleWidth={1.5}
              linkDirectionalParticleSpeed={(d: any) => (d.value * 0.003)}
              linkWidth={(d: any) => Math.sqrt(d.value) * 1.8}
              linkColor={() => "rgba(59, 130, 246, 0.4)"}
              nodeCanvasObject={(node: any, ctx, globalScale) => {
                const label = node.id
                const fontSize = 15 / globalScale
                ctx.font = node.group === 1 ? `bold ${fontSize}px "Pretendard"` : `${fontSize}px "Pretendard"`
                const textWidth = ctx.measureText(label).width
                const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * (node.group === 1 ? 1.2 : 0.8))

                const colors = [
                  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
                  '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'
                ]
                const colorIndex = Math.abs(node.id.split('').reduce((a: number, b: string) => {
                  a = ((a << 5) - a) + b.charCodeAt(0);
                  return a & a;
                }, 0)) % colors.length
                const nodeColor = colors[colorIndex]

                ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
                ctx.shadowBlur = 4 / globalScale

                const x = node.x - bckgDimensions[0] / 2
                const y = node.y - bckgDimensions[1] / 2
                const w = bckgDimensions[0]
                const h = bckgDimensions[1]
                const r = node.group === 1 ? 4 / globalScale : h / 2

                ctx.beginPath()
                if (node.group === 1) {
                  ctx.roundRect(x, y, w, h, 8 / globalScale)
                } else {
                  ctx.roundRect(x, y, w, h, r)
                }
                
                ctx.fillStyle = "white"
                ctx.fill()
                
                ctx.strokeStyle = nodeColor
                ctx.lineWidth = (node.group === 1 ? 3 : 1.5) / globalScale
                ctx.stroke()

                ctx.textAlign = "center"
                ctx.textBaseline = "middle"
                ctx.fillStyle = nodeColor
                ctx.shadowBlur = 0
                ctx.fillText(label, node.x, node.y)

                node.__bckgDimensions = bckgDimensions
              }}
              nodePointerAreaPaint={(node: any, color, ctx) => {
                ctx.fillStyle = color
                const bckgDimensions = node.__bckgDimensions
                bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1])
              }}
              cooldownTicks={100}
              d3AlphaDecay={0.02}
              d3VelocityDecay={0.4}
            />
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {isFullscreen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFullscreen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[90]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-[5%] bg-white dark:bg-slate-950 z-[100] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-8 py-6 border-b shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Share2 className="h-6 w-6 text-blue-500" />
                    전체 네트워크 분석
                  </h2>
                  <p className="text-slate-500">단어들의 상호작용을 큰 화면에서 자유롭게 탐색하세요.</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsFullscreen(false)}
                  className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 h-12 w-12"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex-1 overflow-hidden bg-slate-50/30 dark:bg-slate-950/30 flex items-center justify-center p-4">
                <ForceGraph2D
                  graphData={graphData}
                  width={window.innerWidth * 0.9}
                  height={window.innerHeight * 0.75}
                  nodeLabel="id"
                  nodeRelSize={10}
                  linkDirectionalArrowLength={8}
                  linkDirectionalArrowRelPos={1}
                  linkDirectionalParticles={6}
                  linkDirectionalParticleWidth={2}
                  linkDirectionalParticleSpeed={(d: any) => (d.value * 0.003)}
                  linkWidth={(d: any) => Math.sqrt(d.value) * 2.5}
                  linkColor={() => "rgba(59, 130, 246, 0.4)"}
                  // Reuse the same nodeCanvasObject for consistency
                  nodeCanvasObject={(node: any, ctx, globalScale) => {
                    const label = node.id
                    const fontSize = 16 / globalScale
                    ctx.font = node.group === 1 ? `bold ${fontSize}px "Pretendard"` : `${fontSize}px "Pretendard"`
                    const textWidth = ctx.measureText(label).width
                    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * (node.group === 1 ? 1.4 : 1.0))
                    
                    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316']
                    const colorIndex = Math.abs(node.id.split('').reduce((a: number, b: string) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0)) % colors.length
                    const nodeColor = colors[colorIndex]
                    
                    ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
                    ctx.shadowBlur = 6 / globalScale
                    const x = node.x - bckgDimensions[0] / 2
                    const y = node.y - bckgDimensions[1] / 2
                    const w = bckgDimensions[0]
                    const h = bckgDimensions[1]
                    const r = node.group === 1 ? 6 / globalScale : h / 2
                    
                    ctx.beginPath()
                    if (node.group === 1) ctx.roundRect(x, y, w, h, 10 / globalScale)
                    else ctx.roundRect(x, y, w, h, r)
                    ctx.fillStyle = "white"
                    ctx.fill()
                    ctx.strokeStyle = nodeColor
                    ctx.lineWidth = (node.group === 1 ? 4 : 2) / globalScale
                    ctx.stroke()
                    ctx.textAlign = "center"
                    ctx.textBaseline = "middle"
                    ctx.fillStyle = nodeColor
                    ctx.fillText(label, node.x, node.y)
                    node.__bckgDimensions = bckgDimensions
                  }}
                  cooldownTicks={150}
                  d3AlphaDecay={0.015}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
