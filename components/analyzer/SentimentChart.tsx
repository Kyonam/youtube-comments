"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface SentimentChartProps {
  data: {
    positive: number;
    negative: number;
    neutral: number;
  }
}

const COLORS = ["#10b981", "#ef4444", "#94a3b8"]; // green, red, slate

export function SentimentChart({ data }: SentimentChartProps) {
  const chartData = [
    { name: "긍정", value: data.positive },
    { name: "부정", value: data.negative },
    { name: "중립", value: data.neutral },
  ].filter(d => d.value > 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>감정 분석 분포</CardTitle>
        <CardDescription>댓글들의 전반적인 감정 분포를 나타냅니다.</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
