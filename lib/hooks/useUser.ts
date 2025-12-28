"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isVIP, setIsVIP] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // 1️⃣ Auth state
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setProfileLoaded(!data.user);
      setUser(data.user ?? null);
      setLoading(false);
    });

    const { data: listener } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setProfileLoaded(!session?.user);
        setUser(session?.user ?? null);
        setLoading(false);
      });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 2️⃣ Profile state
  useEffect(() => {
    if (!user) {
      setIsVIP(false);
      setIsAdmin(false);
      setProfileLoaded(true);
      return;
    }

    setProfileLoaded(false);

    supabase
      .from("profiles")
      .select("is_vip, is_admin")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setIsVIP(!!data?.is_vip);
        setIsAdmin(!!data?.is_admin);
        setProfileLoaded(true);
      });
  }, [user]);

  return {
    user,
    isVIP,
    isAdmin,
    loading,
    profileLoaded,
  };
}
