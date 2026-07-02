import type { Metadata } from "next";
import "./globals.css";
import WalletProvider from "@/components/WalletProvider";

export const metadata: Metadata = {
  title: "PredX — Prediction Market Protocol",
  description:
    "Trade on prediction markets from one interface. Powered by Polymarket.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
