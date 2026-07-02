"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center">
              <span className="text-bg-primary font-bold text-sm">R</span>
            </div>
            <span className="text-text-primary font-bold text-xl tracking-tight">
              Rush
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/markets"
              className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium"
            >
              Markets
            </Link>
            <a
              href="#how-it-works"
              className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium"
            >
              How it works
            </a>
            <a
              href="#features"
              className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium"
            >
              Features
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/markets"
              className="px-5 py-2 bg-gradient-to-r from-accent-green to-accent-blue text-bg-primary font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity"
            >
              Launch App
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-text-secondary"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-bg-secondary border-b border-border">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/markets"
              className="block text-text-secondary hover:text-text-primary text-sm font-medium"
              onClick={() => setMobileOpen(false)}
            >
              Markets
            </Link>
            <a
              href="#how-it-works"
              className="block text-text-secondary hover:text-text-primary text-sm font-medium"
              onClick={() => setMobileOpen(false)}
            >
              How it works
            </a>
            <Link
              href="/markets"
              className="block w-full text-center px-5 py-2 bg-gradient-to-r from-accent-green to-accent-blue text-bg-primary font-semibold text-sm rounded-lg"
              onClick={() => setMobileOpen(false)}
            >
              Launch App
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
