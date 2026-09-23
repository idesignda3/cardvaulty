import type { Metadata } from "next";
import { requireUser } from "@/lib/session";
import { signOut } from "@/auth";

export const metadata: Metadata = {
  title: "Account",
};

export default async function AccountPage() {
  const user = await requireUser();

  return (
    <main className="mx-auto w-full max-w-lg flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Account
      </h1>
      <div className="mt-6 space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Trainer name</p>
          <p className="mt-1 text-zinc-900 dark:text-zinc-50">{user.name || "—"}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Email</p>
          <p className="mt-1 text-zinc-900 dark:text-zinc-50">{user.email}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Role</p>
          <p className="mt-1 text-zinc-900 dark:text-zinc-50">{user.role}</p>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="mt-2 rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}
