const GAMMA_API = "https://gamma-api.polymarket.com";
const CLOB_API = "https://clob.polymarket.com";

export async function fetchMarkets(params?: {
  limit?: number;
  offset?: number;
  order?: string;
  ascending?: boolean;
  active?: boolean;
  closed?: boolean;
  liquidity_num_min?: number;
  volume_num_min?: number;
}) {
  const query = new URLSearchParams();
  const p = {
    limit: 20,
    active: true,
    closed: false,
    order: "volume24hr",
    ascending: false,
    liquidity_num_min: 1000,
    ...params,
  };

  Object.entries(p).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
      query.set(k, String(v));
    }
  });

  const res = await fetch(`${GAMMA_API}/markets?${query}`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`Polymarket API error: ${res.status}`);
  return res.json();
}

export async function fetchEvents(params?: {
  limit?: number;
  offset?: number;
  active?: boolean;
  closed?: boolean;
  order?: string;
  ascending?: boolean;
  liquidity_min?: number;
}) {
  const query = new URLSearchParams();
  const p = {
    limit: 20,
    active: true,
    closed: false,
    order: "volume",
    ascending: false,
    ...params,
  };

  Object.entries(p).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
      query.set(k, String(v));
    }
  });

  const res = await fetch(`${GAMMA_API}/events?${query}`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`Polymarket API error: ${res.status}`);
  return res.json();
}

export async function fetchMarketBySlug(slug: string) {
  const res = await fetch(`${GAMMA_API}/markets?slug=${slug}`, {
    next: { revalidate: 15 },
  });
  if (!res.ok) throw new Error(`Market not found: ${res.status}`);
  const markets = await res.json();
  return markets[0] || null;
}

export async function fetchMidpoint(tokenId: string) {
  const res = await fetch(`${CLOB_API}/midpoint?token_id=${tokenId}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchOrderBook(tokenId: string) {
  const res = await fetch(`${CLOB_API}/book?token_id=${tokenId}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function searchMarkets(query: string) {
  const res = await fetch(
    `${GAMMA_API}/markets?_q=${encodeURIComponent(query)}&limit=20&active=true&closed=false`,
    { next: { revalidate: 30 } }
  );
  if (!res.ok) throw new Error(`Search error: ${res.status}`);
  return res.json();
}

export function formatVolume(num: number): string {
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`;
  return `$${num.toFixed(0)}`;
}

export function formatPrice(price: number): string {
  return `${Math.round(price * 100)}¢`;
}

export function formatPercent(price: number): string {
  return `${Math.round(price * 100)}%`;
}
