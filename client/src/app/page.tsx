import { Navbar } from "@/components/Navbar";
import { Pill } from "@/components/Pill";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf7f2]">
      <Navbar />

      <div className="px-10 pt-12">
        {/* Headline */}
        <h1 className="text-6xl font-semibold tracking-tight text-center">
          Turning Celebrations Into Experiences.
        </h1>

        {/* Buttons */}
        <div className="flex justify-center gap-6 mt-8">
          <Link href="/events">
            <Pill>Shop by Events</Pill>
          </Link>
          <Link href="/products">
            <Pill>Browse Products</Pill>
          </Link>
        </div>

        {/* Image grid */}
        <div className="grid grid-cols-4 gap-10 mt-14 max-w-6xl mx-auto">
          {[
            "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1520975682031-a9fdbbdf1a21?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1000&q=80",
          ].map((src, i) => (
            <div key={i} className="bg-white/40 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                className="w-full h-[420px] object-cover"
                alt=""
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
