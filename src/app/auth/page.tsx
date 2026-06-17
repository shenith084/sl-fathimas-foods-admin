"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Shield } from "lucide-react";
import { auth } from "@/lib/firebase/client";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from "firebase/auth";
import { createOrUpdateUserDoc, isAdminUser } from "@/lib/services/userService";

type Mode = "login" | "register" | "forgot";

async function redirectByRole(user: any, fallbackRedirect: string | null, router: ReturnType<typeof useRouter>) {
  router.push("/admin/dashboard");
}

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams ? searchParams.get("redirect") : null;

  const [mode, setMode] = useState<Mode>("login");
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in — check role first
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await redirectByRole(user, redirect, router);
      }
    });
    return () => unsubscribe();
  }, [router, redirect]);

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, form.email, form.password);
      // Ensure user document exists in Firestore
      await createOrUpdateUserDoc(userCred.user.uid, form.email, userCred.user.displayName);
      // Route by role
      await redirectByRole(userCred.user, redirect, router);
    } catch (err: any) {
      console.error("Login error:", err);
      let msg = "Failed to sign in. Please check your credentials.";
      if (err.code === "auth/configuration-not-found") {
        msg = "Email/Password sign-in is not enabled. Please enable it in Firebase Console → Authentication → Sign-in method.";
      } else if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        msg = "Invalid email or password. Please try again.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Please enter a valid email address.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(userCred.user, { displayName: form.name });
      // Create user document + auto-assign role based on email
      const role = await createOrUpdateUserDoc(userCred.user.uid, form.email, form.name);
      router.push("/admin/dashboard");
    } catch (err: any) {
      console.error("Registration error:", err);
      let msg = "Failed to create account. Please try again.";
      if (err.code === "auth/configuration-not-found") {
        msg = "Email/Password registration is not enabled. Please enable it in Firebase Console → Authentication → Sign-in method.";
      } else if (err.code === "auth/email-already-in-use") {
        msg = "An account with this email already exists. Please sign in instead.";
      } else if (err.code === "auth/weak-password") {
        msg = "Password should be at least 6 characters.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Please enter a valid email address.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, form.email);
      setSent(true);
    } catch (err: any) {
      console.error("Password reset error:", err);
      let msg = "Failed to send reset link.";
      if (err.code === "auth/user-not-found") {
        msg = "No account found with this email address.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Please enter a valid email address.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-[#FAF7F2] min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-[#2C4631] rounded-full flex items-center justify-center text-white font-display font-bold text-xl shadow-sm">
              SL
            </div>
            <div>
              <div className="font-display font-bold text-[#2C4631] text-lg tracking-wide">SL FATHIMA&apos;S</div>
              <div className="font-display font-semibold text-[#D98C1F] text-xs tracking-widest">FOODS</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-md p-7 md:p-8">
          {/* Error display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3 mb-5 font-medium leading-relaxed">
              ⚠️ {error}
            </div>
          )}

          {/* Mode tabs removed for security. Admins can only login. */}

          {/* Forgot Password */}
          {mode === "forgot" && (
            <div>
              <button
                disabled={loading}
                onClick={() => { setMode("login"); setSent(false); setError(""); }}
                className="text-sm text-[#999] hover:text-[#D98C1F] mb-4 flex items-center gap-1 transition-colors"
              >
                ← Back to Sign In
              </button>
              <h2 className="font-display font-bold text-[#222] text-xl mb-1">Forgot Password?</h2>
              <p className="text-[#666] text-sm mb-5">Enter your email and we&apos;ll send you a reset link.</p>
              {sent ? (
                <div className="text-center py-6">
                  <div className="text-5xl mb-4">📧</div>
                  <p className="font-semibold text-[#222]">Reset link sent!</p>
                  <p className="text-[#666] text-sm mt-1">Check your email inbox ({form.email}).</p>
                </div>
              ) : (
                <form onSubmit={handleForgot} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#444] mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#D98C1F] hover:bg-[#B8740F] text-white font-bold py-3.5 rounded-xl transition-colors disabled:bg-gray-300"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Login */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <h2 className="font-display font-bold text-[#222] text-xl mb-1">Welcome back!</h2>
                <p className="text-[#666] text-sm mb-4">Sign in to track your orders and shop faster.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#444] mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-[#444]">Password</label>
                  <button
                    type="button"
                    onClick={() => { setMode("forgot"); setError(""); }}
                    className="text-xs text-[#D98C1F] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999]"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                id="auth-login-btn"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#D98C1F] hover:bg-[#B8740F] text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-md disabled:bg-gray-300"
              >
                {loading ? "Signing In..." : <><span className="select-none">Sign In</span> <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          )}

          {/* Register block removed for admin security */}
        </div>

        <p className="text-center text-xs text-[#999] mt-5">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="hover:text-[#D98C1F] underline">Terms</Link> &{" "}
          <Link href="/privacy-policy" className="hover:text-[#D98C1F] underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="bg-[#FAF7F2] min-h-screen flex items-center justify-center text-[#2C4631] font-semibold">Loading authentication form...</div>}>
      <AuthForm />
    </Suspense>
  );
}

