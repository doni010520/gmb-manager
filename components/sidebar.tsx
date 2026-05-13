"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MapPin,
  LayoutDashboard,
  FileText,
  Star,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/gmb", label: "Google Meu Negócio", icon: MapPin },
  { href: "/gmb/posts", label: "Posts", icon: FileText },
  { href: "/gmb/reviews", label: "Avaliações", icon: Star },
  { href: "/settings", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      {/* Mobile hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center gap-3 glass border-b border-white/[0.06] px-4 h-14">
        <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} className="text-white/70 hover:bg-white/[0.06]">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-[oklch(0.7_0.18_165)]/20">
            <MapPin className="h-4 w-4 text-[oklch(0.8_0.15_165)]" />
          </div>
          <span className="font-bold text-white">GMB Manager</span>
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 glass-strong flex flex-col transition-transform lg:translate-x-0 lg:static",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 h-16 border-b border-white/[0.06]">
          <div className="p-1.5 rounded-lg bg-[oklch(0.7_0.18_165)]/20">
            <MapPin className="h-5 w-5 text-[oklch(0.8_0.15_165)]" />
          </div>
          <span className="text-lg font-bold text-white">GMB Manager</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-[oklch(0.55_0.18_165)]/20 text-[oklch(0.8_0.15_165)]"
                    : "text-white/45 hover:bg-white/[0.06] hover:text-white/80"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/[0.06]">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/40 hover:bg-white/[0.06] hover:text-white/70 transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}
