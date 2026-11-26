import Link from "next/link";
import { notFound } from "next/navigation";

import { AuthForm } from "./auth-form";
import { Badge } from "@/components/ui/badge";
import { isLocale, SIGNUP_PATH } from "@/lib/constants/seo";

import type { AuthMode } from "./auth-form";

const screens = {
  "sign-in": {
    title: "Welcome back",
    description: "Enter your email and password to try the sign-in flow.",
    submitLabel: "Sign in",
    prompt: "New here?",
    link: { path: SIGNUP_PATH, label: "Create an account" },
  },
  "sign-up": {
    title: "Create your account",
    description: "Try the registration flow with a name, email, and password.",
    submitLabel: "Create account",
    prompt: "Already have an account?",
    link: { path: "/sign-in", label: "Sign in" },
  },
  "reset-pwd": {
    title: "Reset your password",
    description: "Enter an email address to preview the password reset flow.",
    submitLabel: "Preview password reset",
    prompt: "Remember your password?",
    link: { path: "/sign-in", label: "Back to sign in" },
  },
} satisfies Record<
  AuthMode,
  {
    title: string;
    description: string;
    submitLabel: string;
    prompt: string;
    link: { path: string; label: string };
  }
>;

export function AuthScreen({ language, mode }: { language: string; mode: AuthMode }) {
  if (!isLocale(language)) {
    notFound();
  }

  const { title, description, submitLabel, prompt, link } = screens[mode];

  return (
    <div className="mx-auto w-full max-w-sm">
      <Badge className="bg-muted text-muted-foreground">Account template</Badge>
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-2 text-sm/6 text-muted-foreground">{description}</p>
      <p className="my-5 rounded-lg border border-line bg-muted px-3 py-2 text-sm/6 text-muted-foreground">
        <strong className="text-foreground">Demo only.</strong> Use sample values. No authentication
        service is connected.
      </p>
      <AuthForm mode={mode} submitLabel={submitLabel} resetHref={`/${language}/reset-pwd`} />
      <p className="mt-6 border-t border-line pt-5 text-center text-sm/6 text-muted-foreground">
        {prompt}{" "}
        <Link
          href={`/${language}${link.path}`}
          className="font-semibold text-accent-text hover:underline"
        >
          {link.label}
        </Link>
      </p>
    </div>
  );
}
