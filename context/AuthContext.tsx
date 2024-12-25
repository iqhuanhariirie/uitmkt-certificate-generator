"use client";

import { db } from "@/firebase/config";
import {
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { collection, onSnapshot, query } from "firebase/firestore";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/config";

export type Admin = {
  email: string;
  role: 'super_admin'|'admin';
  createdAt: Date;
};

export type AuthContextProps = {
  googleLogin: () => void;
  logOut: () => void;
  user: User | null;
  checkIfUserIsAdmin: (user: User) => boolean;
  checkIfUserIsSuperAdmin: (user: User) => boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextProps>({
  googleLogin: () => {},
  logOut: () => {},
  user: null,
  checkIfUserIsAdmin: (user: User) => false,
  checkIfUserIsSuperAdmin: (user: User) => false,
  loading: true,
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminList, setAdminList] = useState<Admin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const googleLogin = () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    signInWithPopup(auth, provider);
  };

  const logOut = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const q = query(collection(db, "admins"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setLoading(true);
      const data: Admin[] = snap.docs.map((doc) => ({
        email: doc.data().email,
        role: doc.data().role,
        createdAt: doc.data().createdAt || ''
      }));
      setAdminList(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const checkIfUserIsAdmin = (user: User) => {
    return (
      adminList.length !== 0 &&
      adminList.some((person) => person.email === user.email)
    );
  };

  const checkIfUserIsSuperAdmin = (user: User) => {
    return adminList.some(
      (admin) => admin.email === user.email && admin.role === 'super_admin'
    );
  };

  return (
    <AuthContext.Provider
      value={{ googleLogin, logOut, user, checkIfUserIsAdmin, checkIfUserIsSuperAdmin, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
