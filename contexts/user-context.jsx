"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useUser as useClerkUser } from "@clerk/nextjs";
import { getCurrentUser } from "@/actions/user";

const UserContext = createContext(undefined);

export function UserProvider({ children }) {
  const { user: clerkUser, isLoaded: clerkLoaded } = useClerkUser();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from database
  const fetchUserData = useCallback(async () => {
    if (!clerkLoaded || !clerkUser) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getCurrentUser();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  }, [clerkLoaded, clerkUser?.id]);

  // Fetch user data when Clerk user is loaded
  useEffect(() => {
    if (clerkLoaded) {
      if (clerkUser) {
        fetchUserData();
      } else {
        setUserData(null);
        setLoading(false);
      }
    }
  }, [clerkLoaded, clerkUser?.id, fetchUserData]);

  // Function to update user data (call this after onboarding/profile update)
  const updateUserData = async () => {
    await fetchUserData();
  };

  // Function to manually set user data (useful for onboarding)
  const setUser = (data) => {
    setUserData(data);
  };

  const value = {
    user: userData,
    loading,
    updateUserData,
    setUser,
    refreshUser: fetchUserData,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
