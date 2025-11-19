"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-provider";
import { getUserByIdentifier } from "@/lib/firebaseUtils";
import LoadingSpinner from "../tools/loading-spinner";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user: authUser } = useAuth(); // must contain user.role

  //   useEffect(() => {
  //     // Wait for user to load
  //     if (!user) return;

  //     // If NOT admin → redirect to dashboard
  //     if (user.role !== "admin") {
  //       router.replace("/dashboard");
  //     }
  //   }, [user, router]);

  useEffect(() => {
    if (!authUser) return;
    const fetchUser = async () => {
      setLoading(true);
      const email = authUser.email; // replace with logged-in user
      const data = await getUserByIdentifier("email", email);
      if (data.role !== "admin") {
        router.replace("/dashboard");
      }
      setLoading(false);
    };
    fetchUser();
  }, [authUser]);

  // While checking user, prevent flashing of admin UI
  if (!authUser || loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <LoadingSpinner size={64} />
      </div>
    );
  }

  // If admin, show protected page
  return <>{children}</>;
}
