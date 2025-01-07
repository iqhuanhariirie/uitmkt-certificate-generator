"use client";

import { Footer } from "@/components/Footer";
import { AdminNavbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { EventDataContextProvider } from "@/context/EventDataContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user === null) {
      router.push("/admin/login");
    }
  }, [user, router]);
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <AdminNavbar />
        <main className="flex-grow">
        <EventDataContextProvider>{children}</EventDataContextProvider>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Layout;
