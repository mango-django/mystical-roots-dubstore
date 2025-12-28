"use client";

import { useUser } from "@/lib/hooks/useUser";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode;
  requireAuth?: boolean;
  requireVIP?: boolean;
  requireAdmin?: boolean;
};

export default function ProtectedRoute({
  children,
  requireAuth = false,
  requireVIP = false,
  requireAdmin = false,
}: Props) {
  const {
    user,
    isVIP,
    isAdmin,
    loading,
    profileLoaded,
  } = useUser();

  const router = useRouter();

  useEffect(() => {
    if (loading || !profileLoaded) return;

    if (requireAuth && !user) {
  document.dispatchEvent(new Event("open-auth"));
  return;
}


    if (requireVIP && !isVIP && !isAdmin) {
      router.push("/");
      return;
    }

    if (requireAdmin && !isAdmin) {
      router.push("/");
      return;
    }
  }, [
    loading,
    profileLoaded,
    user,
    isVIP,
    isAdmin,
    requireAuth,
    requireVIP,
    requireAdmin,
    router,
  ]);

  if (loading || !profileLoaded) {
    return <p className="p-4">Checking access…</p>;
  }

  return <>{children}</>;
}
