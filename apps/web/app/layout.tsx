import type { Metadata } from "next";
import Link from "next/link";
import { Activity, Bot, Boxes, CandlestickChart, FlaskConical, Home, Layers3, Shield, Swords, Trophy } from "lucide-react";
import { WalletButton } from "@/components/wallet-button";
import { getHookDeployment } from "@/lib/xlayer";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "HookForge Protocol",
  description: "The Operating System for Adaptive Markets.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg"
  }
};

const nav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Command", icon: Activity },
  { href: "/trade", label: "Trade", icon: CandlestickChart },
  { href: "/pools", label: "Pools", icon: Layers3 },
  { href: "/studio", label: "Studio", icon: Boxes },
  { href: "/modules", label: "Modules", icon: Shield },
  { href: "/ai-agents", label: "Agents", icon: Bot },
  { href: "/quests", label: "Quests", icon: Trophy },
  { href: "/threats", label: "Threats", icon: Swords },
  { href: "/demo-lab", label: "Demo Lab", icon: FlaskConical }
];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const deployment = await getHookDeployment();

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
                  <span className="block text-xs text-white/50">Adaptive Market OS</span>
                </span>
              </Link>
              <nav className="hidden items-center gap-1 lg:flex">
                {nav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href} className="group flex items-center gap-2 rounded px-3 py-2 text-sm text-white/64 transition hover:bg-white/8 hover:text-white">
                      <Icon className="h-4 w-4 text-forge-cyan/80" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <WalletButton hookAddress={deployment.hookAddress} />
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
