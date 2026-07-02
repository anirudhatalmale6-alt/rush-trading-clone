"use client";

import Link from "next/link";
import Image from "next/image";
import { ParsedMarket } from "@/lib/types";
import { formatVolume, formatPrice } from "@/lib/polymarket";

export default function MarketCard({ market }: { market: ParsedMarket }) {
  const yesPercent = Math.round(market.yesPrice * 100);
  const noPercent = Math.round(market.noPrice * 100);

  return (
    <Link href={`/markets/${market.slug}`}>
      <div className="glass-card p-4 hover:bg-bg-hover transition-all duration-200 cursor-pointer group">
        <div className="flex gap-4">
          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-bg-secondary flex-shrink-0">
            {market.image ? (
              <Image
                src={market.image}
                alt={market.question}
                fill
                className="object-cover"
                sizes="56px"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">
                ?
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-text-primary text-sm font-medium leading-snug line-clamp-2 group-hover:text-accent-blue transition-colors">
              {market.question}
            </h3>

            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-text-muted">Vol</span>
                <span className="text-xs text-text-secondary font-mono">
                  {formatVolume(market.volume)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-text-muted">Liq</span>
                <span className="text-xs text-text-secondary font-mono">
                  {formatVolume(market.liquidity)}
                </span>
              </div>
              {market.volume24h > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-text-muted">24h</span>
                  <span className="text-xs text-text-secondary font-mono">
                    {formatVolume(market.volume24h)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted">Yes</span>
              <span className="price-yes text-base">
                {formatPrice(market.yesPrice)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted">No</span>
              <span className="price-no text-base">
                {formatPrice(market.noPrice)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 h-1.5 bg-bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent-green to-accent-green/70 rounded-full transition-all duration-500"
            style={{ width: `${yesPercent}%` }}
          />
        </div>

        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-accent-green font-mono">
            Yes {yesPercent}%
          </span>
          <span className="text-[10px] text-accent-red font-mono">
            No {noPercent}%
          </span>
        </div>
      </div>
    </Link>
  );
}
