import UsersClient from "@/components/admin/UsersClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Users | Admin Panel",
  description: "Manage system users and their roles.",
};

export default function AdminUsersPage() {
  return (
    <div className="p-6 md:p-8">
      <UsersClient />
    </div>
  );
}
