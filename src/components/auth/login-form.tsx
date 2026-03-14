"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { signInWithPassword } from "@/services/auth";
import { supabase } from "@/lib/supabase/client";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type LoginValues = z.infer<typeof loginSchema>;

type StatusState = { type: "success" | "error"; message: string } | null;

export function LoginForm() {
  const [status, setStatus] = useState<StatusState>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginValues) => {
    setStatus(null);
    const result = await signInWithPassword(values.email, values.password);

    if (result.error) {
      setStatus({ type: "error", message: result.error });
      return;
    }

    setStatus({ type: "success", message: "Signed in! Redirecting..." });

    let destination = "/dashboard/patient";
    if (supabase) {
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .single();
      if (data?.role === "doctor") {
        destination = "/dashboard/doctor";
      }
    }

    router.push(destination);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your ChronoCare AI account.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {status ? (
          <Alert className={status.type === "error" ? "border-red-500 bg-red-50 text-red-900" : "border-green-500 bg-green-50 text-green-900"}>
            <AlertTitle>{status.type === "error" ? "Error" : "Success"}</AlertTitle>
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        ) : null}
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="you@chronocare.ai" {...register("email")} />
            {errors.email ? (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password ? (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            ) : null}
          </div>
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
