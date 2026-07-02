import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rush — Prediction Market Protocol",
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
