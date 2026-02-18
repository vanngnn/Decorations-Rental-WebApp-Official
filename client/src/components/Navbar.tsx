"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function Navbar() {
  const [user, setUser] = useState<any>(null);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isProducts = pathname === "/products";

  const [q, setQ] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // keep input in sync if URL changes
  useEffect(() => {
    setQ(searchParams.get("q") || "");
  }, [searchParams]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  const updateQuery = (nextQ: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextQ.trim()) params.set("q", nextQ.trim());
    else params.delete("q");
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="px-10 py-6 bg-[#faf7f2]">
      <div className="flex items-center gap-4">
        {/* LEFT GROUP */}
        <div className="flex items-center gap-4 shrink-0">
          <Link href="/">
            <div className="rounded-full border border-black px-6 py-2 text-sm whitespace-nowrap">
              LOGO
            </div>
          </Link>

          <Link
            href="/events"
            className="rounded-full border border-black px-6 py-2 text-sm whitespace-nowrap"
          >
            Shop by Events
          </Link>

          <Link
            href="/products"
            className="rounded-full border border-black px-6 py-2 text-sm whitespace-nowrap"
          >
            All Products
          </Link>
        </div>

        {/* SEARCH (flexible, shrinks on 100% zoom) */}
        {isProducts && (
          <div className="flex-1 min-w-0 max-w-[650px]">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") updateQuery(q);
              }}
              placeholder="Search"
              className="w-full rounded-full border border-black px-5 py-2 text-sm bg-transparent outline-none"
            />
          </div>
        )}

        {/* RIGHT GROUP */}
        <div className="ml-auto flex items-center gap-3 shrink-0 whitespace-nowrap">
          {user ? (
            <>
              <div className="rounded-full border border-black px-6 py-2 text-sm whitespace-nowrap">
                Hi, {user.firstName}
              </div>

              <div className="rounded-full border border-black px-6 py-2 text-sm whitespace-nowrap">
                My Bookings
              </div>

              <Link
                href="/cart"
                className="rounded-full border border-black px-6 py-2 text-sm whitespace-nowrap"
              >
                Cart
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-full border border-black px-6 py-2 text-sm whitespace-nowrap hover:bg-black hover:text-white transition"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-black px-6 py-2 text-sm whitespace-nowrap"
              >
                Log in
              </Link>

              <Link
                href="/register"
                className="rounded-full border border-black px-6 py-2 text-sm whitespace-nowrap"
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
