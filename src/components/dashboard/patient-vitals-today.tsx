"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useVitals } from "@/hooks/useVitals";
import type { VitalReading, VitalType } from "@/types/vitals";
import {
  Activity,
  Droplet,
  HeartPulse,
  Thermometer,
  Wind,
} from "lucide-react";

const vitalMeta: Array<{
  key: VitalType | "blood_pressure";
  label: string;
  unit: string;
  icon: typeof HeartPulse;
}> = [
  { key: "heart_rate", label: "Heart rate", unit: "bpm", icon: HeartPulse },
  { key: "blood_pressure", label: "Blood pressure", unit: "mmHg", icon: Activity },
  { key: "glucose", label: "Glucose", unit: "mg/dL", icon: Droplet },
  { key: "oxygen", label: "Oxygen", unit: "%", icon: Wind },
  { key: "temperature", label: "Temperature", unit: "\u00B0F", icon: Thermometer },
];

function formatTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getLatestReading(readings: VitalReading[], type: VitalType) {
  return readings.find((reading) => reading.type === type) ?? null;
}

function getLatestBloodPressure(readings: VitalReading[]) {
  const bloodPressure = readings.filter((reading) => reading.type === "blood_pressure");

  if (!bloodPressure.length) {
    return null;
  }

  const latestTimestamp = new Date(bloodPressure[0].recordedAt).getTime();
  const latestGroup = bloodPressure.filter(
    (reading) => new Date(reading.recordedAt).getTime() === latestTimestamp
  );
  const values = latestGroup.map((reading) => reading.value);
  const systolic = Math.max(...values);
  const diastolic = Math.min(...values);

  return {
    value: values.length > 1 ? `${systolic}/${diastolic}` : `${systolic}`,
    unit: latestGroup[0]?.unit ?? "mmHg",
    recordedAt: latestGroup[0]?.recordedAt ?? new Date().toISOString(),
  };
}

export function PatientVitalsToday() {
  const { userId } = useCurrentUser();
  const { data: vitals } = useVitals(userId ?? "");

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(startOfDay.getDate() + 1);

  const todaysVitals = (vitals ?? [])
    .filter((reading) => {
      const recordedAt = new Date(reading.recordedAt).getTime();
      return recordedAt >= startOfDay.getTime() && recordedAt < endOfDay.getTime();
    })
    .sort(
      (a, b) =>
        new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
    );

  const latestBloodPressure = getLatestBloodPressure(todaysVitals);

  return (
    <Card className="border-border/60 bg-gradient-to-br from-muted/40 via-background to-background">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Today&apos;s vitals</CardTitle>
          <p className="text-sm text-muted-foreground">
            Snapshot of the most recent readings captured today.
          </p>
        </div>
        <Badge variant="secondary">
          {todaysVitals.length ? `${todaysVitals.length} readings` : "No data"}
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-5">
        {vitalMeta.map((meta) => {
          const Icon = meta.icon;
          const reading =
            meta.key === "blood_pressure"
              ? latestBloodPressure
              : getLatestReading(todaysVitals, meta.key as VitalType);
          const value = reading
            ? "value" in reading
              ? reading.value
              : "--"
            : "--";
          const unit = reading
            ? "unit" in reading
              ? reading.unit
              : meta.unit
            : meta.unit;
          const recordedAt = reading && "recordedAt" in reading ? reading.recordedAt : null;

          return (
            <div
              key={meta.key}
              className="rounded-xl border border-border/60 bg-background/80 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{meta.label}</span>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-semibold">{value}</span>
                <span className="text-xs text-muted-foreground">{unit}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {recordedAt ? `Updated ${formatTime(recordedAt)}` : "No reading yet"}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
