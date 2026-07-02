"use client";

import { useState } from "react";
import Header from "@/components/Header";

const MOCK_LEADERS = [
  {
    rank: 1,
    address: "7xKX...mP9r",
    profit: 45230,
    trades: 312,
    winRate: 72,
    volume: 185000,
  },
  {
    rank: 2,
    address: "3sSN...tbHP",
    profit: 38100,
    trades: 256,
    winRate: 68,
    volume: 152000,
  },
  {
    rank: 3,
    address: "Dk4N...qW2e",
    profit: 29870,
    trades: 198,
    winRate: 71,
    volume: 118000,
  },
  {
    rank: 4,
    address: "9pLm...kJ5x",
    profit: 22450,
    trades: 445,
    winRate: 59,
    volume: 210000,
  },
  {
    rank: 5,
    address: "Bx7R...vN3d",
    profit: 19800,
    trades: 167,
    winRate: 74,
    volume: 95000,
  },
  {
    rank: 6,
    address: "FmQ2...hR8y",
    profit: 15670,
    trades: 289,
    winRate: 61,
    volume: 134000,
  },
  {
    rank: 7,
    address: "Ks9T...wL4p",
    profit: 12340,
    trades: 134,
    winRate: 66,
    volume: 67000,
  },
  {
    rank: 8,
    address: "HvW5...cE2m",
    profit: 10200,
    trades: 98,
    winRate: 69,
    volume: 52000,
  },
  {
    rank: 9,
    address: "Yt6D...nB7s",
    profit: 8900,
    trades: 223,
    winRate: 57,
    volume: 89000,
  },
  {
    rank: 10,
    address: "Qp3G...xA1f",
    profit: 7650,
    trades: 78,
    winRate: 73,
    volume: 41000,
  },
];

type TimeFrame = "24h" | "7d" | "30d" | "all";

export default function LeaderboardPage() {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("30d");

  function formatNum(n: number): string {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
    return `$${n}`;
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                Leaderboard
              </h1>
              <p className="text-sm text-text-muted mt-1">
                Top traders by profit
              </p>
            </div>

            <div className="flex items-center gap-1 bg-bg-card border border-border rounded-lg p-1">
              {(["24h", "7d", "30d", "all"] as TimeFrame[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeFrame(tf)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    timeFrame === tf
                      ? "bg-accent-blue text-bg-primary"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  {tf === "all" ? "All Time" : tf.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Top 3 podium */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {MOCK_LEADERS.slice(0, 3).map((leader, i) => (
              <div
                key={leader.rank}
                className={`glass-card p-5 text-center ${
                  i === 0
                    ? "border-accent-yellow/30"
                    : i === 1
                    ? "border-text-muted/20"
                    : "border-amber-700/20"
                }`}
              >
                <div
                  className={`w-10 h-10 mx-auto mb-3 rounded-full flex items-center justify-center text-sm font-bold ${
                    i === 0
                      ? "bg-accent-yellow/20 text-accent-yellow"
                      : i === 1
                      ? "bg-text-muted/20 text-text-secondary"
                      : "bg-amber-700/20 text-amber-600"
                  }`}
                >
                  #{leader.rank}
                </div>
                <div className="text-sm text-text-primary font-mono font-medium mb-1">
                  {leader.address}
                </div>
                <div className="text-xl font-bold text-accent-green font-mono">
                  +{formatNum(leader.profit)}
                </div>
                <div className="flex items-center justify-center gap-3 mt-2">
                  <span className="text-xs text-text-muted">
                    {leader.trades} trades
                  </span>
                  <span className="text-xs text-accent-green">
                    {leader.winRate}% win
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Full table */}
          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs text-text-muted font-medium px-5 py-3 w-16">
                    Rank
                  </th>
                  <th className="text-left text-xs text-text-muted font-medium px-3 py-3">
                    Trader
                  </th>
                  <th className="text-right text-xs text-text-muted font-medium px-3 py-3">
                    Profit
                  </th>
                  <th className="text-right text-xs text-text-muted font-medium px-3 py-3 hidden sm:table-cell">
                    Volume
                  </th>
                  <th className="text-right text-xs text-text-muted font-medium px-3 py-3 hidden md:table-cell">
                    Trades
                  </th>
                  <th className="text-right text-xs text-text-muted font-medium px-5 py-3">
                    Win Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {MOCK_LEADERS.map((leader) => (
                  <tr
                    key={leader.rank}
                    className="border-b border-border/50 hover:bg-bg-hover transition-colors"
                  >
                    <td className="px-5 py-4">
                      <span
                        className={`text-sm font-mono font-bold ${
                          leader.rank <= 3
                            ? leader.rank === 1
                              ? "text-accent-yellow"
                              : leader.rank === 2
                              ? "text-text-secondary"
                              : "text-amber-600"
                            : "text-text-muted"
                        }`}
                      >
                        #{leader.rank}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <span className="text-sm text-text-primary font-mono">
                        {leader.address}
                      </span>
                    </td>
                    <td className="text-right px-3 py-4">
                      <span className="text-sm text-accent-green font-mono font-semibold">
                        +{formatNum(leader.profit)}
                      </span>
                    </td>
                    <td className="text-right px-3 py-4 hidden sm:table-cell">
                      <span className="text-sm text-text-secondary font-mono">
                        {formatNum(leader.volume)}
                      </span>
                    </td>
                    <td className="text-right px-3 py-4 hidden md:table-cell">
                      <span className="text-sm text-text-secondary font-mono">
                        {leader.trades}
                      </span>
                    </td>
                    <td className="text-right px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-12 h-1.5 bg-bg-secondary rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="h-full bg-accent-green rounded-full"
                            style={{ width: `${leader.winRate}%` }}
                          />
                        </div>
                        <span className="text-sm text-text-primary font-mono">
                          {leader.winRate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
