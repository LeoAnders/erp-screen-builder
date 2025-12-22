import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { auth, signIn } from "@/lib/auth";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/teams");
  }

  async function handleGoogleSignIn() {
    "use server";
    await signIn("google", { redirectTo: "/teams" });
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#09090b] text-white selection:bg-white/20">
      <LoginForm onGoogleSignIn={handleGoogleSignIn} />
    </div>
  );
}
