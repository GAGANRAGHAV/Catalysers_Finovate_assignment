"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
      <p className="mt-2 text-center">
        You do not have permission to access this page.
      </p>
      <Button
        className="mt-4"
        onClick={() => router.push("/loginsignup")}
      >
        Go to Login
      </Button>
    </div>
  );
}
