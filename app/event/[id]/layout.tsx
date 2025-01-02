import { Footer } from "@/components/Footer";
import { GuestNavbar, AdminNavbar } from "@/components/Navbar";
import { ReactNode } from "react";
import { Toaster } from 'react-hot-toast';


const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      
      <div className="h-screen flex flex-col">
        <AdminNavbar />
        {children}
        <Footer />
      </div>
    </>
  );
};

export default Layout;
