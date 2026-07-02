"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Header from "@/components/Header";
import StatsBar from "@/components/StatsBar";
import MarketCard from "@/components/MarketCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import { Market, parseMarket, ParsedMarket } from "@/lib/types";

export default function MarketsPage() {
  const [markets, setMarkets] = useState<ParsedMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const debounceRef = useRef<NodeJS.Timeout>();

  const fetchData = useCallback(
    async (q?: string, cat?: string) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ limit: "30" });
        if (q) params.set("q", q);
        if (cat && cat !== "all") params.set("category", cat);

        const res = await fetch(`/api/markets?${params}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setMarkets(data.map((m: Market) => parseMarket(m)));
        }
      } catch {
        setMarkets([]);
      }
      setLoading(false);
    },
    []
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = useCallback(
    (q: string) => {
      setSearch(q);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        fetchData(q, category);
      }, 400);
    },
    [category, fetchData]
  );

  const handleCategory = useCallback(
    (cat: string) => {
      setCategory(cat);
      fetchData(search, cat);
    },
    [search, fetchData]
  );

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />
      <div className="pt-16">
        <StatsBar />
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Markets</h1>
            <p className="text-sm text-text-muted mt-1">
              Browse and trade on prediction markets
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-lg transition-colors ${
                view === "grid"
                  ? "bg-bg-card text-text-primary"
                  : "text-text-muted hover:text-text-secondary"
              }`}
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
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-lg transition-colors ${
                view === "list"
                  ? "bg-bg-card text-text-primary"
                  : "text-text-muted hover:text-text-secondary"
              }`}
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        <div className="mb-6">
          <CategoryFilter active={category} onChange={handleCategory} />
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card p-4 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-lg bg-bg-secondary" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-bg-secondary rounded w-3/4" />
                    <div className="h-3 bg-bg-secondary rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : markets.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-text-muted text-sm">
              No markets found. Try a different search.
            </p>
          </div>
        ) : view === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {markets.map((m) => (
              <MarketCard key={m.id} market={m} />
            ))}
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs text-text-muted font-medium px-4 py-3">
                    Market
                  </th>
                  <th className="text-right text-xs text-text-muted font-medium px-4 py-3 hidden sm:table-cell">
                    Volume
                  </th>
                  <th className="text-right text-xs text-text-muted font-medium px-4 py-3">
                    Yes
                  </th>
                  <th className="text-right text-xs text-text-muted font-medium px-4 py-3">
                    No
                  </th>
                </tr>
              </thead>
              <tbody>
                {markets.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-border/50 hover:bg-bg-hover transition-colors cursor-pointer"
                    onClick={() =>
                      (window.location.href = `/markets/${m.slug}`)
                    }
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm text-text-primary line-clamp-1">
                        {m.question}
                      </span>
                    </td>
                    <td className="text-right px-4 py-3 hidden sm:table-cell">
                      <span className="text-sm text-text-secondary font-mono">
                        {m.volume24h > 0
                          ? `$${(m.volume24h / 1000).toFixed(0)}K`
                          : "-"}
                      </span>
                    </td>
                    <td className="text-right px-4 py-3">
                      <span className="price-yes text-sm">
                        {Math.round(m.yesPrice * 100)}¢
                      </span>
                    </td>
                    <td className="text-right px-4 py-3">
                      <span className="price-no text-sm">
                        {Math.round(m.noPrice * 100)}¢
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
