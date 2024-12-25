"use client";

import { AdminInviteForm } from "@/components/AdminInviteForm";
import { AdminList } from "@/components/AdminList";
import { AdminNavbar } from "@/components/Navbar";
import * as Separator from '@radix-ui/react-separator';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function ManageAdmins() {
  const { user, checkIfUserIsSuperAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/admin/login");
      } else if (!checkIfUserIsSuperAdmin(user)) {
        router.push("/admin/home");
      }
    }
  }, [user, loading, router, checkIfUserIsSuperAdmin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || !checkIfUserIsSuperAdmin(user)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header Section */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Management</h1>
            <p className="text-muted-foreground">
              Manage administrator access and permissions
            </p>
          </div>
          
          <Separator.Root className="h-[1px] bg-border" />

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Invite Form Section */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">Add New Administrator</h2>
              <AdminInviteForm />
            </div>

            {/* Admin List Section */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">Current Administrators</h2>
              <AdminList />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}