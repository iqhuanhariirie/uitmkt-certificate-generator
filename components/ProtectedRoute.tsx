// components/ProtectedRoute.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { RingLoader } from "@/components/RingLoader";
import { AdminNavbar } from "./Navbar";

export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
}) {
  const { user, loading, checkIfUserIsAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }

    if (!loading && requireAdmin && user && !checkIfUserIsAdmin(user)) {
      router.push('/unauthorized'); // Create this page for unauthorized access
    }
  }, [user, loading, router, requireAdmin, checkIfUserIsAdmin]);

  if (loading) {
    return (
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-center">
            <RingLoader />
          </div>
        </div>
      );
  }

  if (!user) {
    return null;
  }

  if (requireAdmin && !checkIfUserIsAdmin(user)) {
    return null;
  }

  return <>{children}</>;
}