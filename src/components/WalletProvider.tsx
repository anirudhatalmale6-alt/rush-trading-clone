"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface WalletState {
  connected: boolean;
  address: string | null;
  balance: number;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletState>({
  connected: false,
  address: null,
  balance: 0,
  connect: async () => {},
  disconnect: () => {},
});

export function useWallet() {
  return useContext(WalletContext);
}

export default function WalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);

  const connect = useCallback(async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = (window as any).solana;
      if (w?.isPhantom) {
        const resp = await w.connect();
        const addr = resp.publicKey.toString();
        setAddress(addr);
        setConnected(true);

        try {
          const res = await fetch(
            `https://solana-rpc.publicnode.com`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "getBalance",
                params: [addr],
              }),
            }
          );
          const data = await res.json();
          if (data.result?.value) {
            setBalance(data.result.value / 1e9);
          }
        } catch {}
      } else {
        window.open("https://phantom.app/", "_blank");
      }
    } catch {
      console.error("Wallet connection failed");
    }
  }, []);

  const disconnect = useCallback(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = (window as any).solana;
      if (w?.disconnect) w.disconnect();
    } catch {}
    setConnected(false);
    setAddress(null);
    setBalance(0);
  }, []);

  return (
    <WalletContext.Provider
      value={{ connected, address, balance, connect, disconnect }}
    >
      {children}
    </WalletContext.Provider>
  );
}
