import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-semibold">
            C
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight">ChronoCare AI</p>
            <p className="text-xs text-muted-foreground">Remote patient intelligence</p>
          </div>
          <Badge variant="secondary" className="ml-2">Beta</Badge>
        </div>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link className="text-muted-foreground hover:text-foreground" href="/dashboard/patient">
            Patient
          </Link>
          <Link className="text-muted-foreground hover:text-foreground" href="/dashboard/doctor">
            Doctor
          </Link>
          <Link className="text-muted-foreground hover:text-foreground" href="/vitals">
            Vitals
          </Link>
          <Link className="text-muted-foreground hover:text-foreground" href="/medications">
            Medications
          </Link>
          <Link className="text-muted-foreground hover:text-foreground" href="/alerts">
            Alerts
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild className="hidden md:inline-flex">
            <Link href="/auth/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/signup">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
