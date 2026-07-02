import Link from "next/link";
import Header from "@/components/Header";
import { fetchMarkets } from "@/lib/polymarket";
import { Market, parseMarket } from "@/lib/types";
import { formatVolume, formatPrice } from "@/lib/polymarket";
import Image from "next/image";

export const revalidate = 60;

async function getTopMarkets() {
  try {
    const data = await fetchMarkets({
      limit: 6,
      order: "volume24hr",
      ascending: false,
      liquidity_num_min: 5000,
    });
    return (data as Market[]).map(parseMarket);
  } catch {
    return [];
  }
}

export default async function Home() {
  const topMarkets = await getTopMarkets();

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-green/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent-blue/5 rounded-full blur-[120px]" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-card border border-border mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            <span className="text-xs text-text-secondary">
              Live on Polymarket
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6">
            <span className="text-text-primary">The prediction</span>
            <br />
            <span className="gradient-text">market protocol</span>
          </h1>

          <p className="text-text-secondary text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Trade on real-world events. Access Polymarket liquidity from one
            clean interface with real-time pricing and transparent settlement.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link
              href="/markets"
              className="px-8 py-3.5 bg-gradient-to-r from-accent-green to-accent-blue text-bg-primary font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity"
            >
              Launch App
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-3.5 border border-border text-text-secondary text-sm font-medium rounded-lg hover:border-border-hover hover:text-text-primary transition-colors"
            >
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* Live Markets Preview */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-mono text-text-muted">
                [00]/ LIVE SURFACE
              </span>
              <h2 className="text-2xl font-bold text-text-primary mt-1">
                Trending Markets
              </h2>
            </div>
            <Link
              href="/markets"
              className="text-sm text-accent-blue hover:text-accent-blue/80 transition-colors flex items-center gap-1"
            >
              View all
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs text-text-muted font-medium px-5 py-3">
                    Market
                  </th>
                  <th className="text-right text-xs text-text-muted font-medium px-5 py-3 hidden sm:table-cell">
                    24h Volume
                  </th>
                  <th className="text-right text-xs text-text-muted font-medium px-5 py-3 hidden md:table-cell">
                    Liquidity
                  </th>
                  <th className="text-right text-xs text-text-muted font-medium px-5 py-3">
                    Yes
                  </th>
                  <th className="text-right text-xs text-text-muted font-medium px-5 py-3">
                    Trade
                  </th>
                </tr>
              </thead>
              <tbody>
                {topMarkets.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-border/50 hover:bg-bg-hover transition-colors"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/markets/${m.slug}`}
                        className="flex items-center gap-3"
                      >
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-bg-secondary flex-shrink-0">
                          {m.image ? (
                            <Image
                              src={m.image}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="40px"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full bg-bg-card" />
                          )}
                        </div>
                        <span className="text-sm text-text-primary hover:text-accent-blue transition-colors line-clamp-2">
                          {m.question}
                        </span>
                      </Link>
                    </td>
                    <td className="text-right px-5 py-4 hidden sm:table-cell">
                      <span className="text-sm text-text-secondary font-mono">
                        {formatVolume(m.volume24h)}
                      </span>
                    </td>
                    <td className="text-right px-5 py-4 hidden md:table-cell">
                      <span className="text-sm text-text-secondary font-mono">
                        {formatVolume(m.liquidity)}
                      </span>
                    </td>
                    <td className="text-right px-5 py-4">
                      <span className="price-yes text-sm">
                        {formatPrice(m.yesPrice)}
                      </span>
                    </td>
                    <td className="text-right px-5 py-4">
                      <Link
                        href={`/markets/${m.slug}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-accent-green border border-accent-green/30 rounded-lg hover:bg-accent-green/10 transition-colors"
                      >
                        Open
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs font-mono text-text-muted">
            [01]/ HOW IT WORKS
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mt-2 mb-4">
            Three steps. One interface.
          </h2>
          <p className="text-text-secondary text-lg mb-12 max-w-2xl">
            Connect your wallet, find a market, place your trade. Settlement is
            handled automatically.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Connect",
                desc: "Link your Solana wallet. Phantom, Solflare, Backpack — all supported. No accounts, no KYC.",
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "Compose",
                desc: "Browse live markets. Select your outcome — Yes or No — set your amount, and preview the trade.",
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Hold",
                desc: "Your positions are tracked in real-time. When the market resolves, winning shares pay $1 each.",
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
              },
            ].map((item) => (
              <div
                key={item.step}
                className="glass-card p-6 hover:border-border-hover transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-accent-blue/10 flex items-center justify-center text-accent-blue">
                    {item.icon}
                  </div>
                  <span className="text-xs font-mono text-text-muted">
                    [{item.step}]
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs font-mono text-text-muted">
            [02]/ FEATURES
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mt-2 mb-12">
            Built for speed and clarity
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                title: "Real-time pricing",
                desc: "Live bid/ask spreads from Polymarket's central limit order book. Prices update continuously.",
              },
              {
                title: "Non-custodial",
                desc: "Your funds stay in your wallet until you sign. No deposits, no lock-ups, no counterparty risk.",
              },
              {
                title: "Transparent fees",
                desc: "Flat per-trade fee. No hidden spreads. Every settlement is an on-chain transaction you can verify.",
              },
              {
                title: "One interface",
                desc: "No jumping between platforms. Browse, research, and trade prediction markets from a single dashboard.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="p-6 border border-border/50 rounded-xl hover:border-border-hover transition-colors"
              >
                <h3 className="text-base font-semibold text-text-primary mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Start trading predictions
          </h2>
          <p className="text-text-secondary text-lg mb-8">
            Connect your wallet and place your first trade in under 30 seconds.
          </p>
          <Link
            href="/markets"
            className="inline-flex px-8 py-3.5 bg-gradient-to-r from-accent-green to-accent-blue text-bg-primary font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity"
          >
            Launch App
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center">
              <span className="text-bg-primary font-bold text-xs">P</span>
            </div>
            <span className="text-text-muted text-sm">PredX Protocol</span>
          </div>
          <p className="text-text-muted text-xs">
            Powered by Polymarket. Not financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
