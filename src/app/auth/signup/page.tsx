import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6">
      <SignupForm />
      <p className="text-sm text-muted-foreground">
        Already have an account? <Link className="text-foreground underline" href="/auth/login">Sign in</Link>
      </p>
    </div>
  );
}
