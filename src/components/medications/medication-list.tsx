"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useMedications } from "@/hooks/useMedications";

export function MedicationList() {
  const { userId } = useCurrentUser();
  const { data: medications, toggleMedication } = useMedications(userId ?? "");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medication reminders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {(medications ?? []).map((medication) => (
          <div key={medication.id} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{medication.name}</p>
              <p className="text-xs text-muted-foreground">
                {medication.dosage} &middot; {medication.frequency}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toggleMedication({ id: medication.id, isActive: !medication.isActive })
              }
            >
              {medication.isActive ? "Pause" : "Resume"}
            </Button>
          </div>
        ))}
        {medications?.length ? null : (
          <p className="text-sm text-muted-foreground">No medications scheduled.</p>
        )}
      </CardContent>
    </Card>
  );
}
