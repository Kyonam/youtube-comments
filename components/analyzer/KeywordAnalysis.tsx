"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface Keyword {
  text: string;
  value: number;
}

const COLORS = [
  "#3b82f6", "#8b5cf6", "#10b981", "#6366f1", "#ec4899", 
  "#f59e0b", "#0ea5e9", "#f43f5e", "#14b8a6", "#7c3aed"
];

export function KeywordAnalysis({ keywords }: { keywords: Keyword[] }) {
  // Sort keywords by value descending
  const sortedKeywords = [...keywords].sort((a, b) => b.value - a.value).slice(0, 10);
  
  return (
    <Card className="min-h-[400px]">
      <CardHeader>
        <CardTitle>고빈도 키워드 분석</CardTitle>
        <CardDescription>가장 많이 언급된 상위 10개 키워드입니다.</CardDescription>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedKeywords}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="text" 
              type="category" 
              tick={{ fontSize: 13, fontWeight: 600 }}
              width={80}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
            />
            <Bar 
              name="빈도"
              dataKey="value" 
              radius={[0, 6, 6, 0]} 
              barSize={20}
              animationDuration={1500}
            >
              {sortedKeywords.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
