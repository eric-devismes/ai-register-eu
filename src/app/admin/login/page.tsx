"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [step, setStep] = useState<"password" | "totp">("password");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid credentials");
        return;
      }

      setStep("totp");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleTotpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-totp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid code");
        return;
      }

      router.push("/admin");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-900">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-2xl font-bold text-navy-900">
            AI Compass EU
          </h1>
          <p className="mt-1 text-sm text-text-secondary">Admin Panel</p>
        </div>

        {step === "password" ? (
          <form onSubmit={handlePasswordSubmit}>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text-primary"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-border px-4 py-3 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue"
              placeholder="Enter your admin password"
              required
              autoFocus
            />

            {error && (
              <p className="mt-3 text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-eu-blue px-4 py-3 text-sm font-semibold text-white transition hover:bg-eu-blue-light disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Continue"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleTotpSubmit}>
            <div className="mb-4 rounded-lg bg-navy-50 p-3 text-center">
              <p className="text-sm text-navy-700">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>

            <label
              htmlFor="code"
              className="block text-sm font-medium text-text-primary"
            >
              Verification Code
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/[^0-9]/g, ""))
              }
              className="mt-1 block w-full rounded-lg border border-border px-4 py-3 text-center text-2xl tracking-[0.5em] focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue"
              placeholder="000000"
              required
              autoFocus
            />

            {error && (
              <p className="mt-3 text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="mt-6 w-full rounded-lg bg-eu-blue px-4 py-3 text-sm font-semibold text-white transition hover:bg-eu-blue-light disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Sign In"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("password");
                setCode("");
                setError("");
              }}
              className="mt-3 w-full text-sm text-text-secondary hover:text-text-primary"
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
