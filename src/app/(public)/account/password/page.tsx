"use client";

import { useState } from "react";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export default function PasswordPage() {
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    
    if (newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    setSaving(true);
    try {
      const user = auth.currentUser;
      if (user && user.email) {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        setSuccessMsg("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err: any) {
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setErrorMsg("Current password is incorrect.");
      } else {
        setErrorMsg("Failed to change password. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-full max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-[#222]">Change Password</h1>
        <p className="text-sm text-[#555] mt-1">Update your account password securely.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <form onSubmit={handlePasswordChange} className="space-y-5">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4 font-medium">
              ⚠️ {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl p-4 font-medium">
              ✅ {successMsg}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <label className="text-sm font-medium text-[#555] sm:w-40 flex-shrink-0">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-[#D98C1F] transition-colors"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <label className="text-sm font-medium text-[#555] sm:w-40 flex-shrink-0">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="w-full bg-transparent border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-[#D98C1F] transition-colors"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <label className="text-sm font-medium text-[#555] sm:w-40 flex-shrink-0">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full bg-transparent border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-[#D98C1F] transition-colors"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-8 bg-[#1F1F1F] hover:bg-[#333] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 text-sm tracking-wide"
            >
              {saving ? "SAVING..." : "UPDATE PASSWORD"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
