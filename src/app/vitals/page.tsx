import { VitalsChart } from "@/components/vitals/vitals-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VitalsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground">Vital tracking</p>
        <h2 className="text-3xl font-semibold tracking-tight">Realtime vitals</h2>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <VitalsChart />
        <Card>
          <CardHeader>
            <CardTitle>Insights</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Capture vitals from connected devices, validate them, and surface trends for care teams.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
