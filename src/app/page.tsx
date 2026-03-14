import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="grid gap-8 rounded-3xl border border-border/60 bg-background p-10 shadow-sm md:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Badge variant="secondary">Production-ready starter</Badge>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            ChronoCare AI
          </h1>
          <p className="text-lg text-muted-foreground">
            Deliver continuous patient monitoring with realtime vitals, AI-assisted
            insights, and automated clinical alerts.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/dashboard/patient">View patient dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/doctor">View doctor dashboard</Link>
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          {[
            "Supabase-backed authentication",
            "Realtime vitals tracking",
            "Medication adherence workflows",
            "Clinical alert escalation",
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-border/60 bg-muted/30 p-4">
              <p className="text-sm font-medium">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Patient dashboard</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Track vitals, adherence, and personalized care plans in one place.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Doctor dashboard</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Monitor cohorts, review trends, and respond to alerts faster.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Automation layer</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Use alerts and reminders to automate follow-ups and reduce manual work.
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
