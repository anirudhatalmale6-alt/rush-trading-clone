"use client";

const CATEGORIES = [
  { label: "All", slug: "all" },
  { label: "Politics", slug: "politics" },
  { label: "Crypto", slug: "crypto" },
  { label: "Sports", slug: "sports" },
  { label: "Science", slug: "science" },
  { label: "Culture", slug: "culture" },
  { label: "Business", slug: "business" },
  { label: "Tech", slug: "tech" },
];

export default function CategoryFilter({
  active,
  onChange,
}: {
  active: string;
  onChange: (category: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => onChange(cat.slug)}
          className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            active === cat.slug
              ? "bg-accent-blue text-bg-primary"
              : "bg-bg-card text-text-secondary border border-border hover:border-border-hover hover:text-text-primary"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
