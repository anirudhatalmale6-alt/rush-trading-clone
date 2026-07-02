"use client";

import { useEffect, useState } from "react";
import { formatVolume } from "@/lib/polymarket";

interface Stats {
  totalVolume: number;
  totalMarkets: number;
  totalLiquidity: number;
}

export default function StatsBar() {
  const [stats, setStats] = useState<Stats>({
    totalVolume: 0,
    totalMarkets: 0,
    totalLiquidity: 0,
  });

  useEffect(() => {
    fetch("/api/markets?limit=100")
      .then((r) => r.json())
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((markets: any[]) => {
        if (!Array.isArray(markets)) return;
        const totalVolume = markets.reduce(
          (sum, m) => sum + (m.volumeNum || parseFloat(m.volume) || 0),
          0
        );
        const totalLiquidity = markets.reduce(
          (sum, m) => sum + (m.liquidityNum || parseFloat(m.liquidity) || 0),
          0
        );
        setStats({
          totalVolume,
          totalMarkets: markets.length,
          totalLiquidity,
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex items-center justify-center gap-8 py-3 border-b border-border bg-bg-secondary/50">
      <div className="flex items-center gap-2">
        <span className="text-xs text-text-muted">Markets</span>
        <span className="text-xs text-text-primary font-mono font-semibold">
          {stats.totalMarkets}+
        </span>
      </div>
      <div className="hidden sm:flex items-center gap-2">
        <span className="text-xs text-text-muted">Volume</span>
        <span className="text-xs text-text-primary font-mono font-semibold">
          {formatVolume(stats.totalVolume)}
        </span>
      </div>
      <div className="hidden sm:flex items-center gap-2">
        <span className="text-xs text-text-muted">Liquidity</span>
        <span className="text-xs text-text-primary font-mono font-semibold">
          {formatVolume(stats.totalLiquidity)}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
        <span className="text-xs text-accent-green font-medium">Live</span>
      </div>
    </div>
  );
}
