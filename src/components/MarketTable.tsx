"use client";

import Link from "next/link";
import Image from "next/image";
import { ParsedMarket } from "@/lib/types";
import { formatVolume, formatPrice } from "@/lib/polymarket";

export default function MarketTable({ markets }: { markets: ParsedMarket[] }) {
  if (!markets.length) {
    return (
      <div className="text-center py-12 text-text-muted">
        No markets found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left text-xs text-text-muted font-medium px-4 py-3">
              Market
            </th>
            <th className="text-right text-xs text-text-muted font-medium px-4 py-3 hidden sm:table-cell">
              24h Vol
            </th>
            <th className="text-right text-xs text-text-muted font-medium px-4 py-3 hidden md:table-cell">
              Liquidity
            </th>
            <th className="text-right text-xs text-text-muted font-medium px-4 py-3">
              Yes
            </th>
            <th className="text-right text-xs text-text-muted font-medium px-4 py-3 hidden sm:table-cell">
              No
            </th>
            <th className="text-right text-xs text-text-muted font-medium px-4 py-3">
              Trade
            </th>
          </tr>
        </thead>
        <tbody>
          {markets.map((m, i) => (
            <tr
              key={m.id}
              className="border-b border-border/50 hover:bg-bg-hover transition-colors group"
              style={{
                animationDelay: `${i * 50}ms`,
              }}
            >
              <td className="px-4 py-3">
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
                  <span className="text-sm text-text-primary group-hover:text-accent-blue transition-colors line-clamp-2">
                    {m.question}
                  </span>
                </Link>
              </td>
              <td className="text-right px-4 py-3 hidden sm:table-cell">
                <span className="text-sm text-text-secondary font-mono">
                  {formatVolume(m.volume24h)}
                </span>
              </td>
              <td className="text-right px-4 py-3 hidden md:table-cell">
                <span className="text-sm text-text-secondary font-mono">
                  {formatVolume(m.liquidity)}
                </span>
              </td>
              <td className="text-right px-4 py-3">
                <span className="price-yes text-sm">
                  {formatPrice(m.yesPrice)}
                </span>
              </td>
              <td className="text-right px-4 py-3 hidden sm:table-cell">
                <span className="price-no text-sm">
                  {formatPrice(m.noPrice)}
                </span>
              </td>
              <td className="text-right px-4 py-3">
                <Link
                  href={`/markets/${m.slug}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-accent-green border border-accent-green/30 rounded-lg hover:bg-accent-green/10 transition-colors"
                >
                  Trade
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
  );
}
