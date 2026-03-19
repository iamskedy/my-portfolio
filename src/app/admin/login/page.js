"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to authenticate");
      }

      // On success, redirect to the actual dashboard layout
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#161616] text-[#f0f0f0] font-[family-name:var(--font-geist-sans)] p-5">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-10">
          <h1 className="text-[2.5rem] font-extralight tracking-[2px] mb-[10px] uppercase">
            ADMIN
          </h1>
          <p className="text-[#888888] text-[0.9rem]">
            Secure access to portfolio content.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 text-center">
              {error}
            </div>
          )}

          <div className="mb-[25px]">
            <label className="block text-[0.8rem] tracking-[1px] text-[#888888] mb-[10px] uppercase">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="shubham.dubey@gmail.com"
              required
              className="w-full p-[15px] bg-[#1e1e1e] border border-[#333] text-[#f0f0f0] text-[0.95rem] font-light rounded-none focus:outline-none focus:border-[#f0f0f0] transition-colors duration-300"
            />
          </div>

          <div className="mb-[25px]">
            <label className="block text-[0.8rem] tracking-[1px] text-[#888888] mb-[10px] uppercase">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full p-[15px] bg-[#1e1e1e] border border-[#333] text-[#f0f0f0] text-[0.95rem] font-light rounded-none focus:outline-none focus:border-[#f0f0f0] transition-colors duration-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-[15px_30px] bg-[#f0f0f0] text-[#161616] border border-[#f0f0f0] uppercase tracking-[2px] text-[0.8rem] font-medium transition-all duration-300 hover:bg-transparent hover:text-[#f0f0f0] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Authenticating..." : "Login to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
