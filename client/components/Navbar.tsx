"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const links = [
  { href: "/", label: "Home" },
  { href: "/internships", label: "Internships" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/resume", label: "Resume Lab" },
];

function getUserInitial(userName?: string, userEmail?: string) {
  const source = (userName || userEmail || "U").trim();
  return source.slice(0, 1).toUpperCase();
}

export default function Navbar() {
  const pathname = usePathname();
  const { user, token, logout, loading } = useAuth();
  const [avatarFailed, setAvatarFailed] = useState(false);

  useEffect(() => {
    setAvatarFailed(false);
  }, [user?.picture]);

  return (
    <header className="sticky top-0 z-30 border-b border-white/30 bg-[rgba(255,248,236,0.85)] backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="brand-mark">
          CareerPilot
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${active ? "nav-link-active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {loading ? (
            <span className="btn btn-primary opacity-70" aria-hidden="true">
              Login
            </span>
          ) : token ? (
            <>
              <div className="hidden items-center gap-2 md:flex">
                {user?.picture && !avatarFailed ? (
                  <img
                    src={user.picture}
                    alt="Profile"
                    className="h-8 w-8 rounded-full border border-[#efd6b5] object-cover"
                    referrerPolicy="no-referrer"
                    onError={() => setAvatarFailed(true)}
                  />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#efd6b5] bg-[#fff1de] text-xs font-bold text-[#8a3f22]">
                    {getUserInitial(user?.name, user?.email)}
                  </span>
                )}

                <span className="text-sm text-slate-700">{user?.name || user?.email || "Signed in"}</span>
              </div>
              <button className="btn btn-ghost" onClick={logout} type="button">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="btn btn-primary">
              Login
            </Link>
          )}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-6xl gap-1 overflow-x-auto px-4 pb-2 md:hidden">
        {links.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`nav-pill ${active ? "nav-pill-active" : ""}`}>
              {item.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
