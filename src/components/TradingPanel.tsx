"use client";

import { useState } from "react";
import { ParsedMarket } from "@/lib/types";
import { formatPercent } from "@/lib/polymarket";
import { useWallet } from "./WalletProvider";

export default function TradingPanel({ market }: { market: ParsedMarket }) {
  const { connected, connect, balance } = useWallet();
  const [side, setSide] = useState<"yes" | "no">("yes");
  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState(0.5);
  const [showSlippage, setShowSlippage] = useState(false);

  const price = side === "yes" ? market.yesPrice : market.noPrice;
  const amountNum = parseFloat(amount) || 0;
  const shares = amountNum > 0 ? amountNum / price : 0;
  const potentialReturn = shares - amountNum;
  const fee = amountNum * 0.02;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-primary">Trade</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSlippage(!showSlippage)}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-secondary hover:bg-bg-secondary transition-colors"
            title="Slippage settings"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
          <div className="flex items-center gap-1 text-xs text-text-muted">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            Polymarket
          </div>
        </div>
      </div>

      {showSlippage && (
        <div className="mb-4 p-3 bg-bg-secondary rounded-lg">
          <div className="text-xs text-text-muted mb-2">
            Slippage Tolerance
          </div>
          <div className="flex gap-2">
            {[0.5, 1, 2, 5].map((v) => (
              <button
                key={v}
                onClick={() => setSlippage(v)}
                className={`flex-1 py-1.5 text-xs rounded-lg transition-colors ${
                  slippage === v
                    ? "bg-accent-blue text-bg-primary font-semibold"
                    : "bg-bg-card text-text-muted border border-border hover:border-border-hover"
                }`}
              >
                {v}%
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={() => setSide("yes")}
          className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
            side === "yes"
              ? "bg-accent-green/20 text-accent-green border border-accent-green/50 glow-green"
              : "bg-bg-secondary text-text-muted border border-border hover:border-border-hover"
          }`}
        >
          Yes {formatPercent(market.yesPrice)}
        </button>
        <button
          onClick={() => setSide("no")}
          className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
            side === "no"
              ? "bg-accent-red/20 text-accent-red border border-accent-red/50"
              : "bg-bg-secondary text-text-muted border border-border hover:border-border-hover"
          }`}
        >
          No {formatPercent(market.noPrice)}
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs text-text-muted">Amount</label>
          {connected && (
            <button
              onClick={() => setAmount(String(Math.floor(balance * 100) / 100))}
              className="text-xs text-accent-blue hover:text-accent-blue/80 transition-colors"
            >
              Max: {balance.toFixed(2)} SOL
            </button>
          )}
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">
            $
          </span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full pl-7 pr-4 py-2.5 bg-bg-secondary border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue/50 font-mono"
          />
        </div>
        <div className="flex gap-2 mt-2">
          {[1, 5, 10, 25, 50, 100].map((v) => (
            <button
              key={v}
              onClick={() => setAmount(String(v))}
              className="flex-1 py-1 text-xs text-text-muted bg-bg-secondary border border-border rounded hover:border-border-hover hover:text-text-secondary transition-colors"
            >
              ${v}
            </button>
          ))}
        </div>
      </div>

      {amountNum > 0 && (
        <div className="mb-4 p-3 bg-bg-secondary rounded-lg space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">Avg price</span>
            <span className="text-text-secondary font-mono">
              {formatPercent(price)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">Shares</span>
            <span className="text-text-secondary font-mono">
              {shares.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">Fee (2%)</span>
            <span className="text-text-secondary font-mono">
              ${fee.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">Slippage</span>
            <span className="text-text-secondary font-mono">{slippage}%</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between text-xs">
            <span className="text-text-muted">Potential return</span>
            <span className="text-accent-green font-mono font-semibold">
              +${potentialReturn.toFixed(2)} (
              {((potentialReturn / amountNum) * 100).toFixed(0)}%)
            </span>
          </div>
        </div>
      )}

      {connected ? (
        <button
          disabled={amountNum <= 0}
          className={`w-full py-3 rounded-lg text-sm font-semibold transition-all ${
            amountNum > 0
              ? side === "yes"
                ? "bg-accent-green text-bg-primary hover:opacity-90"
                : "bg-accent-red text-white hover:opacity-90"
              : "bg-bg-secondary text-text-muted cursor-not-allowed"
          }`}
        >
          {amountNum > 0
            ? `Buy ${side === "yes" ? "Yes" : "No"} — $${amountNum.toFixed(2)}`
            : "Enter amount"}
        </button>
      ) : (
        <button
          onClick={connect}
          className="w-full py-3 rounded-lg text-sm font-semibold bg-gradient-to-r from-accent-green to-accent-blue text-bg-primary hover:opacity-90 transition-opacity"
        >
          Connect Wallet
        </button>
      )}

      <p className="text-[10px] text-text-muted text-center mt-3">
        Powered by Polymarket CLOB
      </p>
    </div>
  );
}
