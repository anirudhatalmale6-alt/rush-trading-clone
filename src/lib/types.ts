export interface Market {
  id: string;
  question: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  category: string;
  outcomes: string;
  outcomePrices: string;
  volume: string;
  volumeNum: number;
  volume24hr: number;
  liquidity: string;
  liquidityNum: number;
  active: boolean;
  closed: boolean;
  startDate: string;
  endDate: string;
  bestBid: number;
  bestAsk: number;
  lastTradePrice: number;
  conditionId: string;
  clobTokenIds: string;
}

export interface PolyEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  active: boolean;
  closed: boolean;
  liquidity: number;
  volume: number;
  markets: Market[];
  startDate: string;
  endDate: string;
}

export interface ParsedMarket {
  id: string;
  question: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  category: string;
  outcomes: string[];
  prices: number[];
  volume: number;
  volume24h: number;
  liquidity: number;
  active: boolean;
  closed: boolean;
  endDate: string;
  yesPrice: number;
  noPrice: number;
  conditionId: string;
  tokenIds: string[];
}

export function parseMarket(m: Market): ParsedMarket {
  let outcomes: string[] = [];
  let prices: number[] = [];
  let tokenIds: string[] = [];

  try {
    outcomes = JSON.parse(m.outcomes || "[]");
  } catch {
    outcomes = ["Yes", "No"];
  }

  try {
    prices = JSON.parse(m.outcomePrices || "[]").map(Number);
  } catch {
    prices = [0.5, 0.5];
  }

  try {
    const raw = m.clobTokenIds;
    if (raw) {
      if (raw.startsWith("[")) {
        tokenIds = JSON.parse(raw);
      } else {
        tokenIds = raw.split(",").map((s: string) => s.trim());
      }
    }
  } catch {
    tokenIds = [];
  }

  const yesPrice = prices[0] || 0.5;
  const noPrice = prices[1] || 1 - yesPrice;

  return {
    id: m.id,
    question: m.question,
    slug: m.slug,
    description: m.description,
    image: m.image,
    icon: m.icon,
    category: m.category || "General",
    outcomes,
    prices,
    volume: m.volumeNum || parseFloat(m.volume) || 0,
    volume24h: m.volume24hr || 0,
    liquidity: m.liquidityNum || parseFloat(m.liquidity) || 0,
    active: m.active,
    closed: m.closed,
    endDate: m.endDate,
    yesPrice,
    noPrice,
    conditionId: m.conditionId,
    tokenIds,
  };
}
