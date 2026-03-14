"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePatients } from "@/hooks/usePatients";

export function DoctorOverview() {
  const { data: patients } = usePatients();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assigned patients</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {(patients ?? []).map((patient) => (
          <div key={patient.id} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{patient.fullName}</p>
              <p className="text-xs text-muted-foreground">{patient.email}</p>
            </div>
            <span className="text-xs text-muted-foreground">Stable</span>
          </div>
        ))}
        {patients?.length ? null : (
          <p className="text-sm text-muted-foreground">No patients assigned.</p>
        )}
      </CardContent>
    </Card>
  );
}
