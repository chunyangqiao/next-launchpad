import { AuthScreen } from "../_components/auth-screen";

export const metadata = { title: "Reset your password" };

export default async function ResetPwd({ params }: PageProps<"/[language]/reset-pwd">) {
  const { language } = await params;

  return <AuthScreen language={language} mode="reset-pwd" />;
}
