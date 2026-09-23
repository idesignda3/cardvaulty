"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import {
  registerAction,
  signInAction,
  signInWithGoogle,
  type AuthActionState,
} from "./actions";

const initial: AuthActionState = { ok: false };

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1 text-xs text-red-600">{errors[0]}</p>;
}

export function AuthForms({ googleEnabled }: { googleEnabled: boolean }) {
  const params = useSearchParams();
  const mode = params.get("mode") === "register" ? "register" : "signin";
  const [registerState, registerFormAction, registerPending] = useActionState(
    registerAction,
    initial,
  );
  const [signInState, signInFormAction, signInPending] = useActionState(signInAction, initial);

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
        <a
          href="/auth"
          className={`flex-1 rounded-lg px-3 py-2 text-center text-sm font-medium ${
            mode === "signin"
              ? "bg-white text-zinc-900 shadow dark:bg-zinc-900 dark:text-zinc-50"
              : "text-zinc-600 dark:text-zinc-400"
          }`}
        >
          Sign in
        </a>
        <a
          href="/auth?mode=register"
          className={`flex-1 rounded-lg px-3 py-2 text-center text-sm font-medium ${
            mode === "register"
              ? "bg-white text-zinc-900 shadow dark:bg-zinc-900 dark:text-zinc-50"
              : "text-zinc-600 dark:text-zinc-400"
          }`}
        >
          Register
        </a>
      </div>

      {mode === "register" ? (
        <form action={registerFormAction} className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Create your vault</h1>
          {registerState.message && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
              {registerState.message}
            </p>
          )}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Trainer name
            </label>
            <input
              id="name"
              name="name"
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              placeholder="Ash"
              autoComplete="nickname"
            />
            <FieldError errors={registerState.fieldErrors?.name} />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              autoComplete="email"
            />
            <FieldError errors={registerState.fieldErrors?.email} />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              autoComplete="new-password"
            />
            <FieldError errors={registerState.fieldErrors?.password} />
          </div>
          <button
            type="submit"
            disabled={registerPending}
            className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
          >
            {registerPending ? "Creating…" : "Create account"}
          </button>
        </form>
      ) : (
        <form action={signInFormAction} className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Sign in</h1>
          {signInState.message && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
              {signInState.message}
            </p>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={signInPending}
            className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
          >
            {signInPending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      )}

      {googleEnabled && (
        <form action={signInWithGoogle}>
          <button
            type="submit"
            className="w-full rounded-xl border border-zinc-300 bg-white py-2.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            Continue with Google
          </button>
        </form>
      )}
    </div>
  );
}
