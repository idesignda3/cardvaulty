import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, isGoogleAuthEnabled } from "@/auth";
import { AuthForms } from "./auth-forms";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function AuthPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/vault");
  }

  return (
    <main className="flex flex-1 items-start justify-center px-4 py-16 sm:px-6">
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
        <AuthForms googleEnabled={isGoogleAuthEnabled()} />
      </Suspense>
    </main>
  );
}
