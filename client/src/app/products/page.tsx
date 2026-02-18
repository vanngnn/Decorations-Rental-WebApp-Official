"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";

type Product = {
  id: string;
  name: string;
  priceCents: number;
  category: string;
  colour: string;
  imageUrl: string;
};

const CATEGORIES = [
  "Backdrops & Displays",
  "Floor & Space Decor",
  "Table Decor",
  "Entry & Welcome",
  "Hanging & Overhead",
  "Small Decor & Accessories",
];

const COLOURS = ["White", "Cream", "Pink", "Green", "Gold", "Black"];

export default function ProductsPage() {
  const API = process.env.NEXT_PUBLIC_API_URL || "";
  const searchParams = useSearchParams();

  const q = searchParams.get("q") || "";

  // "" means Any
  const [colour, setColour] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!API) return;

    const url = `${API}/products?q=${encodeURIComponent(
      q
    )}&colour=${encodeURIComponent(colour)}`;

    fetch(url)
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => setProducts([]));
  }, [API, q, colour]);

  return (
    <main className="min-h-screen bg-[#faf7f2]">
      <Navbar />

      <div className="px-10">
        {/* Category row */}
        <div className="grid grid-cols-6 gap-10 mt-6">
          {CATEGORIES.map((c) => (
            <div key={c} className="text-center">
              <div className="bg-white/40 p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=800&q=80"
                  className="w-full h-[140px] object-cover"
                  alt=""
                />
              </div>
              <div className="mt-3 text-sm">{c}</div>
            </div>
          ))}
        </div>

        {/* ✅ Colour left, Sort right */}
        <div className="flex items-center justify-between mt-6">
          {/* Colour: + dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-sm">Colour:</span>
            <select
              className="rounded-full border border-black px-6 py-2 text-sm bg-transparent"
              value={colour}
              onChange={(e) => setColour(e.target.value)}
            >
              <option value="">Any</option>
              {COLOURS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <select className="rounded-full border border-black px-6 py-2 text-sm bg-transparent w-[320px] text-center">
            <option>Sort by: Recommended</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-4 gap-16 mt-12 pb-20">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="block text-center"
            >
              <div className="bg-white/40 p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.imageUrl}
                  className="w-full h-[320px] object-cover"
                  alt={p.name}
                />
              </div>

              <div className="mt-6 text-sm">{p.category}</div>
              <div className="mt-3 text-lg">{p.name}</div>
              <div className="mt-2 text-base">
                ${Math.round(p.priceCents / 100)}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
