import { NextRequest, NextResponse } from "next/server";

const GAMMA_API = "https://gamma-api.polymarket.com";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const limit = searchParams.get("limit") || "20";
  const offset = searchParams.get("offset") || "0";
  const category = searchParams.get("category");

  try {
    const params = new URLSearchParams({
      limit,
      offset,
      active: "true",
      closed: "false",
      order: "volume24hr",
      ascending: "false",
    });

    if (query) {
      params.set("_q", query);
    }

    if (category && category !== "all") {
      params.set("tag_slug", category);
    }

    const res = await fetch(`${GAMMA_API}/markets?${params}`, {
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch markets" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
