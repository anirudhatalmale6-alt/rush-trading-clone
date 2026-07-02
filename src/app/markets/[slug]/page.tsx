import { notFound } from "next/navigation";
import Header from "@/components/Header";
import TradingPanel from "@/components/TradingPanel";
import PriceChart from "@/components/PriceChart";
import { fetchMarketBySlug, formatVolume, formatPercent } from "@/lib/polymarket";
import { parseMarket } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 30;

export default async function MarketPage({
  params,
}: {
  params: { slug: string };
}) {
  const raw = await fetchMarketBySlug(params.slug).catch(() => null);
  if (!raw) notFound();

  const market = parseMarket(raw);

  const endDate = market.endDate
    ? new Date(market.endDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-text-muted mb-6">
            <Link href="/markets" className="hover:text-text-secondary transition-colors">
              Markets
            </Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-text-secondary truncate max-w-xs">
              {market.question}
            </span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Market header */}
              <div className="glass-card p-6">
                <div className="flex gap-5">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-bg-secondary flex-shrink-0">
                    {market.image ? (
                      <Image
                        src={market.image}
                        alt={market.question}
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted text-2xl">
                        ?
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-bg-secondary rounded text-xs text-text-muted font-medium">
                        {market.category}
                      </span>
                      {market.active && !market.closed && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-accent-green/10 rounded text-xs text-accent-green font-medium">
                          <span className="w-1 h-1 rounded-full bg-accent-green animate-pulse" />
                          Active
                        </span>
                      )}
                      {market.closed && (
                        <span className="px-2 py-0.5 bg-accent-red/10 rounded text-xs text-accent-red font-medium">
                          Closed
                        </span>
                      )}
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-text-primary leading-snug">
                      {market.question}
                    </h1>
                  </div>
                </div>
              </div>

              {/* Price display */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-5">
                  <div className="text-xs text-text-muted mb-1">Yes</div>
                  <div className="text-3xl font-bold text-accent-green font-mono">
                    {formatPercent(market.yesPrice)}
                  </div>
                  <div className="mt-2 h-2 bg-bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent-green rounded-full"
                      style={{ width: `${market.yesPrice * 100}%` }}
                    />
                  </div>
                </div>
                <div className="glass-card p-5">
                  <div className="text-xs text-text-muted mb-1">No</div>
                  <div className="text-3xl font-bold text-accent-red font-mono">
                    {formatPercent(market.noPrice)}
                  </div>
                  <div className="mt-2 h-2 bg-bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent-red rounded-full"
                      style={{ width: `${market.noPrice * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Price Chart */}
              <PriceChart conditionId={market.conditionId} />

              {/* Stats */}
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-4">
                  Market Stats
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-text-muted">Total Volume</div>
                    <div className="text-sm text-text-primary font-mono font-semibold mt-1">
                      {formatVolume(market.volume)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-text-muted">24h Volume</div>
                    <div className="text-sm text-text-primary font-mono font-semibold mt-1">
                      {formatVolume(market.volume24h)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-text-muted">Liquidity</div>
                    <div className="text-sm text-text-primary font-mono font-semibold mt-1">
                      {formatVolume(market.liquidity)}
                    </div>
                  </div>
                  {endDate && (
                    <div>
                      <div className="text-xs text-text-muted">End Date</div>
                      <div className="text-sm text-text-primary font-mono font-semibold mt-1">
                        {endDate}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {market.description && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-text-primary mb-3">
                    Resolution Details
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                    {market.description}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar - Trading Panel */}
            <div className="space-y-4">
              <TradingPanel market={market} />

              <div className="glass-card p-4">
                <h4 className="text-xs text-text-muted mb-3">Quick Info</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Source</span>
                    <span className="text-accent-blue">Polymarket</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Type</span>
                    <span className="text-text-secondary">Binary</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Outcomes</span>
                    <span className="text-text-secondary">
                      {market.outcomes.join(" / ")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
