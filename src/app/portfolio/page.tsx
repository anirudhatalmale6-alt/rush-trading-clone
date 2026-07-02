"use client";

import Header from "@/components/Header";
import { useWallet } from "@/components/WalletProvider";

const MOCK_POSITIONS = [
  {
    id: "1",
    question: "Will Bitcoin reach $200K by end of 2026?",
    side: "Yes",
    shares: 150,
    avgPrice: 0.35,
    currentPrice: 0.42,
    invested: 52.5,
    currentValue: 63.0,
  },
  {
    id: "2",
    question: "Will the US enter a recession in 2026?",
    side: "No",
    shares: 200,
    avgPrice: 0.6,
    currentPrice: 0.55,
    invested: 120.0,
    currentValue: 110.0,
  },
  {
    id: "3",
    question: "Will SpaceX launch Starship to Mars by 2027?",
    side: "Yes",
    shares: 80,
    avgPrice: 0.15,
    currentPrice: 0.22,
    invested: 12.0,
    currentValue: 17.6,
  },
];

export default function PortfolioPage() {
  const { connected, balance, connect } = useWallet();

  const totalInvested = MOCK_POSITIONS.reduce((s, p) => s + p.invested, 0);
  const totalValue = MOCK_POSITIONS.reduce((s, p) => s + p.currentValue, 0);
  const totalPnl = totalValue - totalInvested;
  const totalPnlPct = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Portfolio
          </h1>
          <p className="text-sm text-text-muted mb-8">
            Track your positions and P&L
          </p>

          {!connected ? (
            <div className="glass-card p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-bg-secondary flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-text-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-text-primary mb-2">
                Connect your wallet
              </h2>
              <p className="text-sm text-text-muted mb-6 max-w-sm mx-auto">
                Connect your Solana wallet to view your positions and trading
                history.
              </p>
              <button
                onClick={connect}
                className="px-8 py-3 bg-gradient-to-r from-accent-green to-accent-blue text-bg-primary font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity"
              >
                Connect Wallet
              </button>
            </div>
          ) : (
            <>
              {/* Overview cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="glass-card p-4">
                  <div className="text-xs text-text-muted mb-1">
                    Wallet Balance
                  </div>
                  <div className="text-xl font-bold text-text-primary font-mono">
                    {balance.toFixed(2)} SOL
                  </div>
                </div>
                <div className="glass-card p-4">
                  <div className="text-xs text-text-muted mb-1">
                    Total Invested
                  </div>
                  <div className="text-xl font-bold text-text-primary font-mono">
                    ${totalInvested.toFixed(2)}
                  </div>
                </div>
                <div className="glass-card p-4">
                  <div className="text-xs text-text-muted mb-1">
                    Current Value
                  </div>
                  <div className="text-xl font-bold text-text-primary font-mono">
                    ${totalValue.toFixed(2)}
                  </div>
                </div>
                <div className="glass-card p-4">
                  <div className="text-xs text-text-muted mb-1">Total P&L</div>
                  <div
                    className={`text-xl font-bold font-mono ${
                      totalPnl >= 0 ? "text-accent-green" : "text-accent-red"
                    }`}
                  >
                    {totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)}
                    <span className="text-sm ml-1">
                      ({totalPnlPct >= 0 ? "+" : ""}
                      {totalPnlPct.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Positions */}
              <div className="glass-card overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                  <h2 className="text-sm font-semibold text-text-primary">
                    Open Positions
                  </h2>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs text-text-muted font-medium px-5 py-3">
                        Market
                      </th>
                      <th className="text-center text-xs text-text-muted font-medium px-3 py-3">
                        Side
                      </th>
                      <th className="text-right text-xs text-text-muted font-medium px-3 py-3 hidden sm:table-cell">
                        Shares
                      </th>
                      <th className="text-right text-xs text-text-muted font-medium px-3 py-3 hidden md:table-cell">
                        Avg Price
                      </th>
                      <th className="text-right text-xs text-text-muted font-medium px-3 py-3">
                        Current
                      </th>
                      <th className="text-right text-xs text-text-muted font-medium px-5 py-3">
                        P&L
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_POSITIONS.map((pos) => {
                      const pnl = pos.currentValue - pos.invested;
                      const pnlPct = (pnl / pos.invested) * 100;
                      return (
                        <tr
                          key={pos.id}
                          className="border-b border-border/50 hover:bg-bg-hover transition-colors"
                        >
                          <td className="px-5 py-4">
                            <span className="text-sm text-text-primary line-clamp-1">
                              {pos.question}
                            </span>
                          </td>
                          <td className="text-center px-3 py-4">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                                pos.side === "Yes"
                                  ? "bg-accent-green/15 text-accent-green"
                                  : "bg-accent-red/15 text-accent-red"
                              }`}
                            >
                              {pos.side}
                            </span>
                          </td>
                          <td className="text-right px-3 py-4 hidden sm:table-cell">
                            <span className="text-sm text-text-secondary font-mono">
                              {pos.shares}
                            </span>
                          </td>
                          <td className="text-right px-3 py-4 hidden md:table-cell">
                            <span className="text-sm text-text-secondary font-mono">
                              {Math.round(pos.avgPrice * 100)}¢
                            </span>
                          </td>
                          <td className="text-right px-3 py-4">
                            <span className="text-sm text-text-primary font-mono">
                              {Math.round(pos.currentPrice * 100)}¢
                            </span>
                          </td>
                          <td className="text-right px-5 py-4">
                            <span
                              className={`text-sm font-mono font-semibold ${
                                pnl >= 0
                                  ? "text-accent-green"
                                  : "text-accent-red"
                              }`}
                            >
                              {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
                              <span className="text-xs ml-1 opacity-70">
                                ({pnlPct >= 0 ? "+" : ""}
                                {pnlPct.toFixed(0)}%)
                              </span>
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
