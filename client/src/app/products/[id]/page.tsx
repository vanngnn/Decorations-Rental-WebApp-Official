"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { addToCart } from "@/lib/cart";

type Product = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  category: string;
  imageUrl: string;
};

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    fetch(`${API}/products/${params.id}`)
      .then((r) => r.json())
      .then(setProduct)
      .catch(() => setProduct(null));
  }, [API, params.id]);

  if (!product) {
    return (
      <main className="min-h-screen bg-[#faf7f2]">
        <Navbar />
        <div className="px-10 py-20">Loading…</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf7f2]">
      <Navbar />

      <div className="px-10 mt-8 grid grid-cols-2 gap-12">
        {/* Left images */}
        <div>
          <div className="bg-white/40 p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.imageUrl}
              className="w-full h-[520px] object-cover"
              alt={product.name}
            />
          </div>

          <div className="bg-white/40 p-2 mt-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.imageUrl}
              className="w-full h-[160px] object-cover opacity-40"
              alt=""
            />
          </div>
        </div>

        {/* Right content */}
        <div className="pt-6">
          <div className="text-2xl font-medium">{product.name}</div>
          <div className="mt-2 text-lg">
            ${Math.round(product.priceCents / 100)}
          </div>

          <div className="mt-10 text-sm tracking-wide">WHEN:</div>
          <div className="mt-5 text-sm tracking-wide">HOW TO GET IT:</div>

          <div className="mt-3 rounded-md border border-black/20 bg-white/40 p-4 text-sm">
            <div className="font-medium">Delivery</div>
            <div className="text-black/60">
              We’ll contact you to confirm details.
            </div>
          </div>

          <div className="mt-10 flex items-center gap-6">
            {/* Qty stepper */}
            <div className="flex items-center rounded-full border border-black overflow-hidden">
              <button
                className="px-5 py-3 text-xl"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                –
              </button>
              <div className="px-6 py-3 text-lg">{qty}</div>
              <button
                className="px-5 py-3 text-xl"
                onClick={() => setQty((q) => q + 1)}
              >
                +
              </button>
            </div>

            {/* Add to cart */}
            <button
              className="flex-1 rounded-full bg-black text-white py-4 text-xl"
              onClick={() => {
                addToCart(product.id, qty);
                alert("Added to cart!");
              }}
            >
              Add to cart
            </button>
          </div>

          <div className="mt-12 text-sm tracking-wide">PRODUCT DETAILS:</div>
          <div className="mt-4 text-black/80">{product.description}</div>

          <div className="mt-10 text-sm tracking-wide">DIMENSIONS:</div>
          <div className="mt-4 text-black/60">Add dimensions later.</div>
        </div>
      </div>
    </main>
  );
}
