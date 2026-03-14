import { DoctorOverview } from "@/components/dashboard/doctor-overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DoctorDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground">Doctor dashboard</p>
        <h2 className="text-3xl font-semibold tracking-tight">Clinical command center</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Active patients</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">18</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Open alerts</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">4</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Today follow-ups</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">6</CardContent>
        </Card>
      </div>
      <DoctorOverview />
    </div>
  );
}
