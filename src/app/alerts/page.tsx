import { AlertList } from "@/components/alerts/alert-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AlertsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground">Alerts system</p>
        <h2 className="text-3xl font-semibold tracking-tight">Clinical escalation</h2>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <AlertList />
        <Card>
          <CardHeader>
            <CardTitle>Alert policies</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Define escalation rules by severity, tie alerts to care plans, and route notifications automatically.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
