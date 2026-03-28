"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Users, TrendingUp, Info } from "lucide-react"

interface SummaryStats {
  totalComments: number;
  avgLength: number;
  positive: number;
  negative: number;
  neutral: number;
}

export function SummaryCards({ stats }: { stats: SummaryStats }) {
  const cards = [
    {
      title: "총 댓글 수",
      value: stats.totalComments,
      icon: MessageSquare,
      color: "text-blue-500",
    },
    {
      title: "평균 댓글 길이",
      value: `${Math.round(stats.avgLength)} 자`,
      icon: TrendingUp,
      color: "text-purple-500",
    },
    {
      title: "긍정 비율",
      value: `${Math.round((stats.positive / stats.totalComments) * 100)}%`,
      icon: Users,
      color: "text-green-500",
    },
    {
      title: "분석 상태",
      value: "완료",
      icon: Info,
      color: "text-amber-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
