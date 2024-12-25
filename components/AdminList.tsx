"use client";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

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
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Current Admins</h2>
      <div className="bg-white shadow overflow-hidden rounded-md">
        <ul className="divide-y divide-gray-200">
          {admins.map((admin) => (
            <li key={admin.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{admin.email}</p>
                <p className="text-sm text-gray-500">
                  Role: {admin.role}
                </p>
                <p className="text-sm text-gray-500">
                  Added: {admin.createdAt?.toLocaleDateString()}
                </p>
              </div>
              {admin.role !== 'super_admin' && (
                <button
                  onClick={() => handleRemoveAdmin(admin.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};