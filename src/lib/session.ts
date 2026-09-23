import { redirect } from "next/navigation";
import { auth } from "@/auth";

/** Require a signed-in session; redirect to /auth if missing. */
export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth");
  }
  return session.user;
}

/** Optional session user (null when signed out). Does not redirect. */
export async function getOptionalUser() {
  const session = await auth();
  return session?.user?.id ? session.user : null;
}
