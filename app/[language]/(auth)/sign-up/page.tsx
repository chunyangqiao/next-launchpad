import { AuthScreen } from "@/components/auth/auth-screen";

export const metadata = { title: "Create an account" };

export default async function SignUp({ params }: PageProps<"/[language]/sign-up">) {
  const { language } = await params;

  return <AuthScreen language={language} mode="sign-up" />;
}
