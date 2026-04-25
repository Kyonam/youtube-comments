'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface KeywordChartProps {
  keywords: string[];
}

const COLORS = ['#3b82f6', '#7c3aed', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e'];

export default function KeywordChart({ keywords = [] }: KeywordChartProps) {
  const data = (keywords || []).slice(0, 10).map((k, i) => ({
    name: k,
    value: 100 - i * 7, // Simulated frequency if not provided, or we could pass counts
    color: COLORS[i % COLORS.length]
  }));

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={80} 
            axisLine={false}
            tickLine={false}
            fontSize={12}
            fontWeight="bold"
            tick={{ fill: '#64748b' }}
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Bar 
            dataKey="value" 
            radius={[0, 4, 4, 0]} 
            barSize={20}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
