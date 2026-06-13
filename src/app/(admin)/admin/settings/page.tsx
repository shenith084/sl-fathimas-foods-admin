"use client";

import { useEffect, useState } from "react";
import { Save, RefreshCw, Settings as SettingsIcon } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";

interface BusinessSettings {
  deliveryCharge?: number;
  freeDeliveryThreshold?: number;
  whatsappNumber?: string;
  bank1Name?: string;
  bank1AccountName?: string;
  bank1AccountNo?: string;
  bank1Branch?: string;
  bank2Name?: string;
  bank2AccountName?: string;
  bank2AccountNo?: string;
  bank2Branch?: string;
  businessEmail?: string;
  businessAddress?: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<BusinessSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/v1/settings")
      .then((r) => r.json())
      .then((data) => { if (data.success) setSettings(data.data); })
      .finally(() => setLoading(false));
  }, []);

  const update = (field: string, value: string | number) =>
    setSettings((prev) => ({ ...prev, [field]: value }));

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/v1/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  async function handleSeedDatabase() {
    if (!confirm("This will seed the database with default products, categories, and settings. Continue?")) return;
    setSeeding(true);
    try {
      const res = await fetch("/api/seed");
      const data = await res.json();
      alert(data.message || "Database seeded successfully!");
    } catch {
      alert("Seed failed. Check console for errors.");
    } finally {
      setSeeding(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#D98C1F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Business configuration, delivery rates, and system settings"
        action={
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#D98C1F] hover:bg-[#B8740F] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saved ? "Saved!" : "Save Settings"}
          </button>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Delivery Settings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-[#222] mb-5 flex items-center gap-2">
            🚚 Delivery Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#555] mb-1.5">
                Standard Delivery Charge (LKR)
              </label>
              <input
                type="number" min="0"
                value={settings.deliveryCharge || ""}
                onChange={(e) => update("deliveryCharge", Number(e.target.value))}
                placeholder="450"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20"
              />
            </div>
          </div>
        </div>

        {/* Contact Settings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-[#222] mb-5">📱 Contact Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#555] mb-1.5">WhatsApp Number</label>
              <input
                value={settings.whatsappNumber || ""}
                onChange={(e) => update("whatsappNumber", e.target.value)}
                placeholder="+94771234567"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#555] mb-1.5">Business Email</label>
              <input
                type="email"
                value={settings.businessEmail || ""}
                onChange={(e) => update("businessEmail", e.target.value)}
                placeholder="slfathimasfoods@gmail.com"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#555] mb-1.5">Business Address</label>
              <input
                value={settings.businessAddress || ""}
                onChange={(e) => update("businessAddress", e.target.value)}
                placeholder="Colombo, Sri Lanka"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20"
              />
            </div>
          </div>
        </div>

        {/* Bank Transfer Settings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-[#222] mb-5">🏦 Bank Transfer Details</h3>
          
          <div className="mb-6">
            <h4 className="text-sm font-bold text-[#D98C1F] mb-3">Bank Account 1</h4>
            <div className="space-y-4">
              {[
                { label: "Bank Name", field: "bank1Name", placeholder: "BOC Bank" },
                { label: "Account Name", field: "bank1AccountName", placeholder: "A R F SHAHANA" },
                { label: "Account Number", field: "bank1AccountNo", placeholder: "12345678" },
                { label: "Branch", field: "bank1Branch", placeholder: "Colombo Branch" },
              ].map((f) => (
                <div key={f.field}>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">{f.label}</label>
                  <input
                    value={(settings as Record<string, string>)[f.field] || ""}
                    onChange={(e) => update(f.field, e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <h4 className="text-sm font-bold text-[#D98C1F] mb-3">Bank Account 2</h4>
            <div className="space-y-4">
              {[
                { label: "Bank Name", field: "bank2Name", placeholder: "Commercial Bank" },
                { label: "Account Name", field: "bank2AccountName", placeholder: "A R F SHAHANA" },
                { label: "Account Number", field: "bank2AccountNo", placeholder: "12345678" },
                { label: "Branch", field: "bank2Branch", placeholder: "Colombo Branch" },
              ].map((f) => (
                <div key={f.field}>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">{f.label}</label>
                  <input
                    value={(settings as Record<string, string>)[f.field] || ""}
                    onChange={(e) => update(f.field, e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Seed System */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-[#222] mb-2 flex items-center gap-2">
            <SettingsIcon className="w-4 h-4" /> Seed System
          </h3>
          <p className="text-xs text-[#888] mb-5">
            Populate the Firestore database with the default product catalog, categories, and system configuration.
            This is safe to run multiple times — it won&apos;t duplicate data.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-xs text-amber-700">
            ⚠️ Running the seed will overwrite existing default categories and settings. Custom products will not be affected.
          </div>
          <button
            onClick={handleSeedDatabase}
            disabled={seeding}
            className="flex items-center gap-2 bg-[#1F1F1F] hover:bg-[#333] text-white text-sm font-semibold px-5 py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            {seeding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {seeding ? "Seeding Database..." : "Run Database Seed"}
          </button>
        </div>
      </div>
    </div>
  );
}
