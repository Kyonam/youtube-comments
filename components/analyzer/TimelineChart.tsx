"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface TimelineData {
  date: string;
  count: number;
  positive: number;
  negative: number;
  neutral: number;
}

export function TimelineChart({ data }: { data: TimelineData[] }) {
  // Sort by date if not already
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>시간대별 감정 추이</CardTitle>
        <CardDescription>날짜별 긍정, 부정, 중립 댓글 수의 변화를 보여줍니다.</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sortedData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="date" 
              tickFormatter={(str) => {
                const date = new Date(str);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
              tick={{ fontSize: 12 }}
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip 
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
            />
            <Legend verticalAlign="top" height={36} align="right" />
            <Line 
              name="긍정"
              type="monotone" 
              dataKey="positive" 
              stroke="#10b981" 
              strokeWidth={3} 
              dot={{ r: 4, fill: "#10b981" }} 
              activeDot={{ r: 6 }}
            />
            <Line 
              name="부정"
              type="monotone" 
              dataKey="negative" 
              stroke="#ef4444" 
              strokeWidth={3} 
              dot={{ r: 4, fill: "#ef4444" }} 
              activeDot={{ r: 6 }}
            />
            <Line 
              name="중립"
              type="monotone" 
              dataKey="neutral" 
              stroke="#94a3b8" 
              strokeWidth={2} 
              strokeDasharray="5 5"
              dot={{ r: 2, fill: "#94a3b8" }} 
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
