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
