"use client";

import * as React from "react";

import { Form } from "@base-ui/react/form";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldDescription, FieldError, FieldLabel, FieldRoot } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export type AuthMode = "sign-in" | "sign-up" | "reset-pwd";

const MIN_PASSWORD_LENGTH = 8;

export function AuthForm({
  mode,
  submitLabel,
  resetHref,
}: {
  mode: AuthMode;
  submitLabel: string;
  resetHref: string;
}) {
  const [submitted, setSubmitted] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const isSignIn = mode === "sign-in";
  const isSignUp = mode === "sign-up";

  return (
    <Form
      action={() => {
        setShowPassword(false);
        setSubmitted(true);
      }}
      onChange={() => setSubmitted(false)}
      className="grid gap-5"
    >
      {isSignUp && (
        <FieldRoot name="name">
          <FieldLabel>Full name</FieldLabel>
          <Input autoComplete="name" required />
          <FieldError match="valueMissing">Enter your name.</FieldError>
        </FieldRoot>
      )}

      <FieldRoot name="email">
        <FieldLabel>Email address</FieldLabel>
        <Input type="email" autoComplete="email" required />
        <FieldError match="valueMissing">Enter your email address.</FieldError>
        <FieldError match="typeMismatch">Enter a valid email address.</FieldError>
      </FieldRoot>

      {mode !== "reset-pwd" && (
        <FieldRoot name="password">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <FieldLabel>Password</FieldLabel>
            {isSignIn && (
              <Link
                href={resetHref}
                className="text-sm font-semibold text-accent-text hover:underline"
              >
                Forgot password?
              </Link>
            )}
          </div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              autoComplete={isSignIn ? "current-password" : "new-password"}
              minLength={isSignUp ? MIN_PASSWORD_LENGTH : undefined}
              className="pr-12"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-1 right-1"
              onClick={() => setShowPassword((visible) => !visible)}
            >
              {showPassword ? (
                <EyeOff aria-hidden="true" className="size-4" />
              ) : (
                <Eye aria-hidden="true" className="size-4" />
              )}
            </Button>
          </div>
          {isSignUp && (
            <FieldDescription>Use at least {MIN_PASSWORD_LENGTH} characters.</FieldDescription>
          )}
          <FieldError match="valueMissing">Enter your password.</FieldError>
          {isSignUp && <FieldError match="tooShort">Your password is too short.</FieldError>}
        </FieldRoot>
      )}

      {isSignIn && (
        <FieldRoot name="remember" className="flex items-center gap-2.5">
          <Checkbox />
          <FieldLabel className="cursor-pointer font-normal">Keep me signed in</FieldLabel>
        </FieldRoot>
      )}

      <div>
        <Button type="submit" className="w-full">
          {submitLabel}
        </Button>
        <div role="status">
          {submitted && (
            <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-sm/6">
              Preview complete. Nothing was sent or saved.
            </p>
          )}
        </div>
      </div>
    </Form>
  );
}
