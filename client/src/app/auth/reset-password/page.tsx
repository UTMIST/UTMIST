"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import logo from "@/assets/logos/utmist-logo-small.svg";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Check if user is authenticated (they should be after clicking reset link)
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth?error=reset_expired");
      }
    };
    checkAuth();
  }, [router]);

  const validateForm = (): boolean => {
    setError("");

    if (!password) {
      setError("Password is required");
      return false;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw new Error(error.message);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      console.error("Password reset error:", err);
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-[var(--background)]">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-2xl border border-[var(--gray3)] shadow-sm space-y-6">
            <div className="flex flex-col items-center">
              <Image
                src={logo}
                alt="UTMIST Logo"
                width={48}
                height={48}
                className="mb-4"
              />
              <h2 className="text-center text-3xl font-bold tracking-tight text-black font-[var(--font-space-grotesk)]">
                Password Reset Successful
              </h2>
              <p className="mt-2 text-center text-sm text-[var(--gray4)] font-[var(--system-font)]">
                Your password has been updated successfully. Redirecting to
                dashboard...
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              ✅ Password reset complete! You&apos;ll be redirected shortly.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-[var(--background)]">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-2xl border border-[var(--gray3)] shadow-sm space-y-6">
          <div className="flex flex-col items-center">
            <Image
              src={logo}
              alt="UTMIST Logo"
              width={48}
              height={48}
              className="mb-4"
            />
            <h2 className="text-center text-3xl font-bold tracking-tight text-black font-[var(--font-space-grotesk)]">
              Reset Your Password
            </h2>
            <p className="mt-2 text-center text-sm text-[var(--gray4)] font-[var(--system-font)]">
              Enter your new password below
            </p>
          </div>

          {error && (
            <div
              className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
              role="alert"
            >
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[var(--gray4)] font-[var(--system-font)]"
              >
                New Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-3 rounded-lg border border-[var(--gray3)] shadow-sm focus:ring-2 focus:ring-[var(--secondary)] focus:border-transparent font-[var(--system-font)] text-black placeholder-[var(--gray2)]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-[var(--gray4)] font-[var(--system-font)]"
              >
                Confirm New Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full px-4 py-3 rounded-lg border border-[var(--gray3)] shadow-sm focus:ring-2 focus:ring-[var(--secondary)] focus:border-transparent font-[var(--system-font)] text-black placeholder-[var(--gray2)]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[var(--secondary)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--secondary)] disabled:opacity-50 disabled:cursor-not-allowed font-[var(--system-font)]"
            >
              {loading ? "Updating Password..." : "Update Password"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push("/auth")}
                className="text-sm text-[var(--gray4)] hover:text-[var(--secondary)] font-[var(--system-font)]"
              >
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
