"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const TOKEN_KEY = "decor_token_v1";

export default function RegisterPage() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [addressLine1, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("Ontario");
  const [postalCode, setPostal] = useState("");
  const [country, setCountry] = useState("Canada");

  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          addressLine1,
          city,
          province,
          postalCode,
          country,
        }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data?.error || "Register failed");

      // auto-login after register
      localStorage.setItem(TOKEN_KEY, data.token);
      router.push("/products");
    } catch {
      alert("Network error. Is your server running on port 5000?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#faf7f2] grid place-items-center px-6">
      <form onSubmit={onSubmit} className="w-full max-w-2xl">
        <div className="text-lg mb-3">Create account</div>

        <div className="grid grid-cols-2 gap-4">
          <input
            className="rounded-xl border border-black/10 px-5 py-4 text-lg bg-white outline-none"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirst(e.target.value)}
          />
          <input
            className="rounded-xl border border-black/10 px-5 py-4 text-lg bg-white outline-none"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLast(e.target.value)}
          />
        </div>

        <input
          className="w-full rounded-xl border border-black/10 px-5 py-4 text-lg bg-white mt-4 outline-none"
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
          autoComplete="new-password"
        />

        <input
          className="w-full rounded-xl border border-black/10 px-5 py-4 text-lg bg-white mt-4 outline-none"
          placeholder="Address"
          value={addressLine1}
          onChange={(e) => setAddress(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4 mt-4">
          <input
            className="rounded-xl border border-black/10 px-5 py-4 text-lg bg-white outline-none"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <select
            className="rounded-xl border border-black/10 px-5 py-4 text-lg bg-white outline-none"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
          >
            <option>Ontario</option>
            <option>Quebec</option>
            <option>British Columbia</option>
            <option>Alberta</option>
            <option>Manitoba</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <input
            className="rounded-xl border border-black/10 px-5 py-4 text-lg bg-white outline-none"
            placeholder="Postal code"
            value={postalCode}
            onChange={(e) => setPostal(e.target.value)}
          />
          <input
            className="rounded-xl border border-black/10 px-5 py-4 text-lg bg-white outline-none"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>

        <button
          disabled={loading}
          className="w-full mt-6 rounded-2xl bg-black text-white py-5 text-xl disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create account"}
        </button>

        <div className="mt-4 text-lg">
          Already have an account?{" "}
          <a className="underline" href="/login">
            Log in
          </a>
        </div>
      </form>
    </main>
  );
}
