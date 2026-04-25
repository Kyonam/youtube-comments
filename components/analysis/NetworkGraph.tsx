'use client';

import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
});

interface Node {
  id: string;
  name: string;
  val: number;
  color: string;
}

interface Link {
  source: string;
  target: string;
}

interface NetworkGraphProps {
  bigrams: string[][];
}

const COLORS = ['#3b82f6', '#7c3aed', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

export default function NetworkGraph({ bigrams }: NetworkGraphProps) {
  const [data, setData] = useState<{ nodes: Node[]; links: Link[] }>({ nodes: [], links: [] });

  useEffect(() => {
    const nodeMap = new Map<string, number>();
    const linkFreqMap = new Map<string, number>();
    
    // Count bigram frequencies
    bigrams.forEach(([word1, word2]) => {
      if (!word1 || !word2) return;
      const linkKey = [word1, word2].sort().join('-');
      linkFreqMap.set(linkKey, (linkFreqMap.get(linkKey) || 0) + 1);
    });

    // Get top 20 bigrams
    const topBigrams = Array.from(linkFreqMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);

    const links: Link[] = [];
    topBigrams.forEach(([linkKey]) => {
      const [word1, word2] = linkKey.split('-');
      links.push({ source: word1, target: word2 });
      
      nodeMap.set(word1, (nodeMap.get(word1) || 0) + 1);
      nodeMap.set(word2, (nodeMap.get(word2) || 0) + 1);
    });

    const nodes: Node[] = Array.from(nodeMap.entries()).map(([name, val], index) => ({
      id: name,
      name,
      val: Math.sqrt(val) * 3 + 8,
      color: COLORS[index % COLORS.length]
    }));

    setData({ nodes, links });
  }, [bigrams]);

  if (data.nodes.length === 0) return <div className="flex items-center justify-center h-full text-muted-foreground">연관 관계를 분석할 수 있는 데이터가 부족합니다.</div>;

  return (
    <div className="w-full h-full min-h-[500px]">
      <ForceGraph2D
        graphData={data}
        nodeLabel="name"
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const label = node.name;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Outfit`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 1.2);

          // Draw background rounded rect
          ctx.fillStyle = 'white';
          ctx.beginPath();
          const [w, h] = bckgDimensions;
          const x = node.x - w / 2;
          const y = node.y - h / 2;
          const r = 4 / globalScale;
          ctx.roundRect(x, y, w, h, r);
          ctx.fill();
          
          // Draw border
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 1.5 / globalScale;
          ctx.stroke();

          // Draw text
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = node.color;
          ctx.fillText(label, node.x, node.y);

          // Store dimensions for collision/hover
          node.__bckgDimensions = bckgDimensions;
        }}
        nodePointerAreaPaint={(node: any, color, ctx) => {
          ctx.fillStyle = color;
          const bckgDimensions = node.__bckgDimensions;
          if (bckgDimensions) {
            const [w, h] = bckgDimensions;
            ctx.fillRect(node.x - w / 2, node.y - h / 2, w, h);
          }
        }}
        linkColor={() => 'rgba(0, 0, 0, 0.05)'}
        linkWidth={1}
        backgroundColor="rgba(0,0,0,0)"
        cooldownTicks={100}
        d3VelocityDecay={0.3}
      />
    </div>
  );
}

