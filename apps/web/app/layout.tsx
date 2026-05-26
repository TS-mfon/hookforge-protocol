import type { Metadata } from "next";
import Link from "next/link";
import { WalletButton } from "@/components/wallet-button";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "HookForge Protocol",
  description: "A focused MVP for using adaptive Uniswap v4 hook behavior.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg"
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-forge-black text-forge-ink">
          <header className="sticky top-0 z-50 border-b border-white/10 bg-forge-black/82 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
              <Link href="/" className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded border border-forge-cyan/40 bg-forge-cyan/10 shadow-glow">
                  <span className="h-4 w-4 rotate-45 border-2 border-forge-green" />
                </span>
                <span>
                  <span className="block text-sm font-semibold tracking-[0.24em] text-white">HOOKFORGE</span>
                  <span className="block text-xs text-white/50">Adaptive v4 hooks</span>
                </span>
              </Link>
              <nav className="hidden items-center gap-2 lg:flex">
                <a href="#use-hook" className="rounded px-3 py-2 text-sm text-white/64 transition hover:bg-white/8 hover:text-white">Use hook</a>
                <a href="#proof" className="rounded px-3 py-2 text-sm text-white/64 transition hover:bg-white/8 hover:text-white">Proof</a>
                <a href="#v4-route" className="rounded px-3 py-2 text-sm text-white/64 transition hover:bg-white/8 hover:text-white">v4 route</a>
              </nav>
              <WalletButton />
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
