"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useMedications } from "@/hooks/useMedications";
import { AlarmClock, Pill } from "lucide-react";

type TimingBadge = {
  label: string;
  variant: "secondary" | "destructive" | "outline";
};

function formatDoseTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getTimingBadge(timestamp: string): TimingBadge {
  const diffMinutes = Math.round(
    (new Date(timestamp).getTime() - Date.now()) / 60000
  );

  if (diffMinutes < 0) {
    return { label: "Overdue", variant: "destructive" };
  }
  if (diffMinutes <= 60) {
    return { label: "Due soon", variant: "secondary" };
  }
  if (diffMinutes <= 180) {
    return { label: "Today", variant: "outline" };
  }

  return { label: "Upcoming", variant: "outline" };
}

export function MedicationReminders() {
  const { userId } = useCurrentUser();
  const { data: medications } = useMedications(userId ?? "");

  const upcoming = (medications ?? [])
    .filter((med) => med.isActive)
    .sort(
      (a, b) =>
        new Date(a.nextDoseAt).getTime() - new Date(b.nextDoseAt).getTime()
    )
    .slice(0, 4);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Medication reminders</CardTitle>
          <p className="text-sm text-muted-foreground">
            Next scheduled doses based on your plan.
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
          <Pill className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcoming.map((medication) => {
          const timing = getTimingBadge(medication.nextDoseAt);

          return (
            <div
              key={medication.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border/60 p-3"
            >
              <div>
                <p className="text-sm font-medium">{medication.name}</p>
                <p className="text-xs text-muted-foreground">
                  {medication.dosage} &middot; {medication.frequency}
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <AlarmClock className="h-3.5 w-3.5" />
                  {formatDoseTime(medication.nextDoseAt)}
                </div>
              </div>
              <Badge variant={timing.variant}>{timing.label}</Badge>
            </div>
          );
        })}
        {upcoming.length ? null : (
          <p className="text-sm text-muted-foreground">
            No active medication reminders.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
