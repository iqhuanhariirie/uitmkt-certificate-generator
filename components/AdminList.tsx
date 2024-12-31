"use client";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { UserCog, Trash2 } from "lucide-react";
import { Button } from "./ui/button";

type Admin = {
  id: string;
  email: string;
  role: 'super_admin' | 'admin';
  createdAt: Date;
};

export const AdminList = () => {
  const { user, checkIfUserIsSuperAdmin } = useAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "admins"), (snapshot) => {
      const adminData: Admin[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        email: doc.data().email,
        role: doc.data().role || 'admin',
        createdAt: doc.data().createdAt?.toDate(),
      }));
      setAdmins(adminData);
    });

    return () => unsubscribe();
  }, []);

  const handleRemoveAdmin = async (adminId: string) => {
    if (!user || !checkIfUserIsSuperAdmin(user)) {
      return;
    }

    try {
      await deleteDoc(doc(db, "admins", adminId));
    } catch (error) {
      console.error("Error removing admin:", error);
    }
  };

  if (!user || !checkIfUserIsSuperAdmin(user)) {
    return null;
  }

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center gap-2">
        <UserCog className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Current Admins</h2>
      </div>
      
      <div className="border rounded-lg divide-y divide-border">
        {admins.map((admin) => (
          <div 
            key={admin.id} 
            className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
          >
            <div className="space-y-1">
              <p className="font-medium">{admin.email}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className={`
                  inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${admin.role === 'super_admin' 
                    ? 'bg-primary/10 text-primary'
                    : 'bg-secondary/10 text-secondary-foreground'
                  }
                `}>
                  {admin.role}
                </span>
                <span className="text-muted-foreground">•</span>
                <span>
                  Added {admin.createdAt?.toLocaleDateString()}
                </span>
              </div>
            </div>

            {admin.role !== 'super_admin' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveAdmin(admin.id)}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {admins.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No admins found
        </div>
      )}
    </div>
  );
};