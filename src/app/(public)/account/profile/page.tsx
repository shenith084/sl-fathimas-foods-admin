"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase/client";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const nameRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // State to hold the saved data for the "Default Address" card
  const [savedData, setSavedData] = useState({
    address: "",
    phone: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/auth?redirect=/account/profile");
        return;
      }
      
      let fetchedPhone = "";
      let fetchedAddress = "";

      // Fetch user doc from Firestore
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          fetchedPhone = data.phone || "";
          fetchedAddress = data.address || "";
        }
      } catch (err) {
        console.error("Failed to load profile data:", err);
      }

      setForm({
        name: user.displayName || "",
        email: user.email || "",
        phone: fetchedPhone,
        address: fetchedAddress,
      });

      setSavedData({
        address: fetchedAddress,
        phone: fetchedPhone,
      });

      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setErrorMsg("Name cannot be empty");
      return;
    }
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const user = auth.currentUser;
      if (user) {
        await updateProfile(user, { displayName: form.name.trim() });
        await setDoc(doc(db, "users", user.uid), {
          displayName: form.name.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          updated_at: serverTimestamp(),
        }, { merge: true });
        
        setSavedData({
          address: form.address.trim(),
          phone: form.phone.trim(),
        });
        
        setSuccessMsg("Profile updated successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch {
      setErrorMsg("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#D98C1F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-[#222]">My Profile</h1>
        <p className="text-sm text-[#555] mt-1">Manage your personal information and account details.</p>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4 mb-6 font-medium">
          ⚠️ {errorMsg}
        </div>
      )}
      
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl p-4 mb-6 font-medium">
          ✅ {successMsg}
        </div>
      )}

      <div className="max-w-2xl">
        {/* Profile Information Form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-[#222] mb-6">Profile Information</h2>
          <form onSubmit={handleProfileSave} className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <label className="text-sm font-medium text-[#555] sm:w-32 flex-shrink-0">Full Name</label>
              <input
                ref={nameRef}
                type="text"
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="w-full bg-transparent border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-[#D98C1F] transition-colors"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <label className="text-sm font-medium text-[#555] sm:w-32 flex-shrink-0">Email Address</label>
              <input
                type="email"
                disabled
                value={form.email}
                className="w-full bg-transparent border-b border-gray-100 py-2 text-sm text-[#888] cursor-not-allowed"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <label className="text-sm font-medium text-[#555] sm:w-32 flex-shrink-0">Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+94 77 123 4567"
                className="w-full bg-transparent border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-[#D98C1F] transition-colors"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
              <label className="text-sm font-medium text-[#555] sm:w-32 flex-shrink-0 mt-2">Address</label>
              <textarea
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                placeholder="No. 123, Main Street, Colombo 07, Sri Lanka"
                rows={3}
                className="w-full bg-transparent border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-[#D98C1F] transition-colors resize-none"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#D98C1F] hover:bg-[#B8740F] text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50 text-sm tracking-wide"
              >
                {saving ? "SAVING..." : "UPDATE PROFILE"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
