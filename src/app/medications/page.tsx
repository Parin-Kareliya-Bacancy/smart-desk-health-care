import { MedicationList } from "@/components/medications/medication-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MedicationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground">Medication reminders</p>
        <h2 className="text-3xl font-semibold tracking-tight">Adherence automation</h2>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <MedicationList />
        <Card>
          <CardHeader>
            <CardTitle>Workflow</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Configure reminders, capture adherence signals, and alert care teams when doses are missed.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
