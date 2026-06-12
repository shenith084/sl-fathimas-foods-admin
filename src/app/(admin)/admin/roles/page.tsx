import RolesClient from "@/components/admin/RolesClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roles & Permissions | Admin Panel",
  description: "Manage system roles and granular permissions",
};

export default function RolesPage() {
  return (
    <div className="p-6 md:p-8">
      <RolesClient />
    </div>
  );
}
