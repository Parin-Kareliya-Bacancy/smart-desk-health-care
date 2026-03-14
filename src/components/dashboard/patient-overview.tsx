"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAlerts } from "@/hooks/useAlerts";
import { useMedications } from "@/hooks/useMedications";
import { useVitals } from "@/hooks/useVitals";

export function PatientOverview() {
  const { userId } = useCurrentUser();
  const { data: vitals } = useVitals(userId ?? "");
  const { data: medications } = useMedications(userId ?? "");
  const { data: alerts } = useAlerts(userId ?? "");

  const activeAlerts = alerts?.filter((alert) => !alert.acknowledged) ?? [];
  const activeMeds = medications?.filter((med) => med.isActive) ?? [];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Latest vitals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {(vitals ?? []).slice(0, 3).map((vital) => (
            <div key={vital.id} className="flex items-center justify-between text-sm">
              <span className="capitalize">{vital.type.replace("_", " ")}</span>
              <span className="font-medium">
                {vital.value} {vital.unit}
              </span>
            </div>
          ))}
          {vitals?.length ? null : (
            <p className="text-sm text-muted-foreground">No readings yet.</p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Medications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-3xl font-semibold">{activeMeds.length}</div>
          <p className="text-sm text-muted-foreground">Active prescriptions</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-semibold">{activeAlerts.length}</span>
            <Badge variant={activeAlerts.length ? "destructive" : "secondary"}>
              {activeAlerts.length ? "Needs attention" : "Stable"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">Open clinical alerts</p>
        </CardContent>
      </Card>
    </div>
  );
}
