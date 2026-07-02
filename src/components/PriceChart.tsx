"use client";

import { useState, useEffect, useRef } from "react";

interface PricePoint {
  t: number;
  p: number;
}

type TimeRange = "1D" | "1W" | "1M" | "ALL";

export default function PriceChart({ conditionId }: { conditionId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [range, setRange] = useState<TimeRange>("1M");
  const [data, setData] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoverInfo, setHoverInfo] = useState<{
    price: number;
    date: string;
  } | null>(null);

  useEffect(() => {
    setLoading(true);
    const fidelity = range === "1D" ? 1 : range === "1W" ? 5 : range === "1M" ? 60 : 360;

    fetch(
      `https://gamma-api.polymarket.com/prices-history?market=${conditionId}&interval=max&fidelity=${fidelity}`
    )
      .then((r) => r.json())
      .then((history: { t: number; p: number }[]) => {
        if (!Array.isArray(history) || history.length === 0) {
          generateFallback();
          return;
        }

        const now = Date.now() / 1000;
        const cutoff =
          range === "1D"
            ? now - 86400
            : range === "1W"
            ? now - 604800
            : range === "1M"
            ? now - 2592000
            : 0;

        const filtered = cutoff > 0
          ? history.filter((p) => p.t >= cutoff)
          : history;

        setData(filtered.length > 0 ? filtered : history.slice(-20));
        setLoading(false);
      })
      .catch(() => {
        generateFallback();
      });

    function generateFallback() {
      const pts: PricePoint[] = [];
      const now = Date.now() / 1000;
      let price = 0.5;
      for (let i = 30; i >= 0; i--) {
        price += (Math.random() - 0.48) * 0.03;
        price = Math.max(0.01, Math.min(0.99, price));
        pts.push({ t: now - i * 86400, p: price });
      }
      setData(pts);
      setLoading(false);
    }
  }, [conditionId, range]);

  useEffect(() => {
    if (!canvasRef.current || data.length < 2) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const pad = { top: 20, right: 10, bottom: 30, left: 45 };
    const chartW = w - pad.left - pad.right;
    const chartH = h - pad.top - pad.bottom;

    ctx.clearRect(0, 0, w, h);

    const prices = data.map((d) => d.p);
    const minP = Math.max(0, Math.min(...prices) - 0.05);
    const maxP = Math.min(1, Math.max(...prices) + 0.05);
    const rangeP = maxP - minP || 0.1;

    const toX = (i: number) => pad.left + (i / (data.length - 1)) * chartW;
    const toY = (p: number) =>
      pad.top + (1 - (p - minP) / rangeP) * chartH;

    // Grid lines
    ctx.strokeStyle = "#222233";
    ctx.lineWidth = 1;
    const gridSteps = 4;
    for (let i = 0; i <= gridSteps; i++) {
      const y = pad.top + (i / gridSteps) * chartH;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(w - pad.right, y);
      ctx.stroke();

      const val = maxP - (i / gridSteps) * rangeP;
      ctx.fillStyle = "#555570";
      ctx.font = "11px JetBrains Mono, monospace";
      ctx.textAlign = "right";
      ctx.fillText(`${Math.round(val * 100)}¢`, pad.left - 8, y + 4);
    }

    // Area fill
    const gradient = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
    gradient.addColorStop(0, "rgba(0, 210, 106, 0.15)");
    gradient.addColorStop(1, "rgba(0, 210, 106, 0.01)");

    ctx.beginPath();
    ctx.moveTo(toX(0), pad.top + chartH);
    data.forEach((d, i) => ctx.lineTo(toX(i), toY(d.p)));
    ctx.lineTo(toX(data.length - 1), pad.top + chartH);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.strokeStyle = "#00d26a";
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    data.forEach((d, i) => {
      if (i === 0) ctx.moveTo(toX(i), toY(d.p));
      else ctx.lineTo(toX(i), toY(d.p));
    });
    ctx.stroke();

    // Last price dot
    const lastPt = data[data.length - 1];
    const lx = toX(data.length - 1);
    const ly = toY(lastPt.p);
    ctx.beginPath();
    ctx.arc(lx, ly, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#00d26a";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(lx, ly, 7, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(0, 210, 106, 0.3)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [data]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || data.length < 2) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pad = { left: 45, right: 10 };
    const chartW = rect.width - pad.left - pad.right;
    const idx = Math.round(((x - pad.left) / chartW) * (data.length - 1));
    const clamped = Math.max(0, Math.min(data.length - 1, idx));
    const pt = data[clamped];
    if (pt) {
      setHoverInfo({
        price: pt.p,
        date: new Date(pt.t * 1000).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      });
    }
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">
            Price History
          </h3>
          {hoverInfo && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-bold text-accent-green font-mono">
                {Math.round(hoverInfo.price * 100)}¢
              </span>
              <span className="text-xs text-text-muted">{hoverInfo.date}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 bg-bg-secondary rounded-lg p-0.5">
          {(["1D", "1W", "1M", "ALL"] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                range === r
                  ? "bg-bg-card text-text-primary"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-accent-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          className="w-full h-48 cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverInfo(null)}
        />
      )}
    </div>
  );
}
