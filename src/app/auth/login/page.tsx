import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6">
      <LoginForm />
      <p className="text-sm text-muted-foreground">
        Need an account? <Link className="text-foreground underline" href="/auth/signup">Sign up</Link>
      </p>
    </div>
  );
}
