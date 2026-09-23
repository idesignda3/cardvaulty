import Link from "next/link";

/** Light auth prompt — does not block public page content. */
export function SignInHint({ message }: { message: string }) {
  return (
    <p className="rounded border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
      {message}{" "}
      <Link href="/auth" className="underline">
        Sign in
      </Link>
    </p>
  );
}
