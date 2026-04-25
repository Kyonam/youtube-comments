'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TimeSeriesChartProps {
  data: any[];
}

export default function TimeSeriesChart({ data }: TimeSeriesChartProps) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis 
            dataKey="time" 
            stroke="var(--muted-foreground)" 
            fontSize={11}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis 
            stroke="var(--muted-foreground)" 
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '12px' }}
          />
          <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
          <Area type="monotone" dataKey="positive" stroke="#10b981" strokeWidth={3} fill="none" />
          <Area type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={3} fill="none" />
          <Area type="monotone" dataKey="neutral" stroke="#6b7280" strokeWidth={3} fill="none" />
          <Area type="monotone" dataKey="total" stroke="var(--primary)" strokeWidth={4} fill="url(#colorTotal)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
