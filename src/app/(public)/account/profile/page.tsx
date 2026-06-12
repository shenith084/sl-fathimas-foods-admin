"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged, updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth, db } from "@/lib/firebase/client";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ChevronLeft, Save, Check } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/auth?redirect=/account/profile");
        return;
      }
      setDisplayName(user.displayName || "");
      setEmail(user.email || "");
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    if (!displayName.trim()) {
      setProfileError("Name cannot be empty");
      return;
    }
    setSavingProfile(true);
    setProfileError("");
    try {
      const user = auth.currentUser;
      if (user) {
        await updateProfile(user, { displayName: displayName.trim() });
        await setDoc(doc(db, "users", user.uid), {
          displayName: displayName.trim(),
          updated_at: serverTimestamp(),
        }, { merge: true });
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 2500);
      }
    } catch {
      setProfileError("Failed to update profile. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    setSavingPassword(true);
    try {
      const user = auth.currentUser;
      if (user && user.email) {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        setPasswordSaved(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordSaved(false), 2500);
      }
    } catch (err: any) {
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setPasswordError("Current password is incorrect.");
      } else {
        setPasswordError("Failed to change password. Please try again.");
      }
    } finally {
      setSavingPassword(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D98C1F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/account" className="text-[#888] hover:text-[#444] transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#222]">My Profile</h1>
            <p className="text-sm text-[#888] mt-0.5">Update your name and password</p>
          </div>
        </div>

        {/* Profile Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
          <h2 className="font-semibold text-[#222] mb-5">Personal Information</h2>
          <form onSubmit={handleProfileSave} className="space-y-4">
            {profileError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3 font-medium">
                ⚠️ {profileError}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-[#444] mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#444] mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-sm text-[#aaa] cursor-not-allowed"
              />
              <p className="text-xs text-[#aaa] mt-1">Email cannot be changed here.</p>
            </div>
            <button
              type="submit"
              disabled={savingProfile}
              className="flex items-center gap-2 bg-[#D98C1F] hover:bg-[#B8740F] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50"
            >
              {savingProfile ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : profileSaved ? (
                <><Check className="w-4 h-4" /> Saved!</>
              ) : (
                <><Save className="w-4 h-4" /> Save Changes</>
              )}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-[#222] mb-5">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {passwordError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3 font-medium">
                ⚠️ {passwordError}
              </div>
            )}
            {passwordSaved && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl p-3 font-medium">
                ✅ Password changed successfully!
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-[#444] mb-1.5">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#444] mb-1.5">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#444] mb-1.5">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={savingPassword}
              className="flex items-center gap-2 bg-[#1F1F1F] hover:bg-[#333] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50"
            >
              {savingPassword ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : passwordSaved ? (
                <><Check className="w-4 h-4" /> Updated!</>
              ) : (
                "Change Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
