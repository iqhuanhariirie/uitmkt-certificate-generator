"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import GoogleButton from "react-google-button";

export const AdminLoginButton = () => {
  const { googleLogin, user, logOut, checkIfUserIsAdmin } = useAuth();
  const [validUser, setValidUser] = useState<boolean>(true);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      googleLogin();
    } catch (error) {
      console.log(error);
    }
  };

  // Use useCallback to memoize the validation function
  const validateUser = useCallback(() => {
    if (user !== null) {
      if (checkIfUserIsAdmin(user)) {
        setValidUser(true);
        router.push("/admin/home");
      } else {
        setValidUser(false);
        logOut();
      }
    }
  }, [user, checkIfUserIsAdmin, logOut, router]);

  // Use the memoized function in useEffect
  useEffect(() => {
    validateUser();
  }, [validateUser]);

  return (
    <>
      <GoogleButton
        data-te-ripple-init
        type="light"
        onClick={handleGoogleLogin}
      />
      {!validUser && (
        <span className="font-title text-red-600">
          Invalid user. Please try again.
        </span>
      )}
    </>
  );
};
