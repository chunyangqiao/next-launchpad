import { AuthScreen } from "../_components/auth-screen";

export const metadata = { title: "Sign in" };

export default async function SignIn({ params }: PageProps<"/[language]/sign-in">) {
  const { language } = await params;

  return <AuthScreen language={language} mode="sign-in" />;
}
