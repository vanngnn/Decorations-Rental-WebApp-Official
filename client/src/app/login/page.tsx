"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data?.error || "Login failed");

      // ✅ Navbar expects these keys:
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/products");
    } catch {
      alert("Network error. Is your server running on port 5000?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#faf7f2] grid place-items-center px-6">
      <form onSubmit={onSubmit} className="w-full max-w-xl">
        <div className="text-lg mb-3">Log in</div>

        <input
          className="w-full rounded-xl border border-black/10 px-5 py-4 text-lg bg-white outline-none"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <input
          className="w-full rounded-xl border border-black/10 px-5 py-4 text-lg bg-white mt-4 outline-none"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <button
          disabled={loading}
          className="w-full mt-6 rounded-2xl bg-black text-white py-5 text-xl disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <div className="mt-4 text-lg">
          Don’t have an account?{" "}
          <a className="underline" href="/register">
            Create one
          </a>
        </div>
      </form>
    </main>
  );
}
