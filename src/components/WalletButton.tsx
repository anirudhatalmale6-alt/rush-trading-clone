"use client";

import { useState } from "react";
import { useWallet } from "./WalletProvider";

export default function WalletButton() {
  const { connected, address, balance, connect, disconnect } = useWallet();
  const [showMenu, setShowMenu] = useState(false);

  if (!connected) {
    return (
      <button
        onClick={connect}
        className="px-5 py-2 bg-gradient-to-r from-accent-green to-accent-blue text-bg-primary font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity"
      >
        Connect Wallet
      </button>
    );
  }

  const short = address
    ? `${address.slice(0, 4)}...${address.slice(-4)}`
    : "";

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-4 py-2 bg-bg-card border border-border rounded-lg hover:border-border-hover transition-colors"
      >
        <div className="w-2 h-2 rounded-full bg-accent-green" />
        <span className="text-sm text-text-primary font-mono">{short}</span>
        <span className="text-xs text-text-muted font-mono">
          {balance.toFixed(2)} SOL
        </span>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-64 glass-card p-4 z-50">
            <div className="text-xs text-text-muted mb-1">Wallet</div>
            <div className="text-sm text-text-primary font-mono break-all mb-3">
              {address}
            </div>

            <div className="text-xs text-text-muted mb-1">Balance</div>
            <div className="text-lg text-text-primary font-mono font-semibold mb-4">
              {balance.toFixed(4)} SOL
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(address || "");
                  setShowMenu(false);
                }}
                className="w-full py-2 text-xs text-text-secondary bg-bg-secondary border border-border rounded-lg hover:border-border-hover transition-colors"
              >
                Copy Address
              </button>
              <button
                onClick={() => {
                  disconnect();
                  setShowMenu(false);
                }}
                className="w-full py-2 text-xs text-accent-red bg-accent-red/10 border border-accent-red/20 rounded-lg hover:bg-accent-red/20 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
