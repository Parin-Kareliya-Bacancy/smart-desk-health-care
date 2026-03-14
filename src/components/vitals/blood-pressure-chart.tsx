"use client";

import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVitals } from "@/hooks/useVitals";

const patientId = "patient-1";

function toMinuteBucket(timestamp: string) {
  const date = new Date(timestamp);
  date.setSeconds(0, 0);
  return date.getTime();
}

export function BloodPressureChart() {
  const { data: vitals } = useVitals(patientId);

  const grouped = new Map<number, number[]>();

  (vitals ?? [])
    .filter((vital) => vital.type === "blood_pressure")
    .forEach((vital) => {
      const bucket = toMinuteBucket(vital.recordedAt);
      const existing = grouped.get(bucket) ?? [];
      existing.push(vital.value);
      grouped.set(bucket, existing);
    });

  const series = Array.from(grouped.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([timestamp, values]) => {
      const systolic = Math.max(...values);
      const diastolic = values.length > 1 ? Math.min(...values) : null;

      return {
        time: new Date(timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        systolic,
        diastolic,
      };
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blood pressure</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        {series.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series}>
              <XAxis dataKey="time" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <Tooltip
                formatter={(value, name) => [
                  `${value} mmHg`,
                  name === "systolic" ? "Systolic" : "Diastolic",
                ]}
              />
              <Legend verticalAlign="top" height={24} />
              <Line
                type="monotone"
                dataKey="systolic"
                stroke="var(--chart-2)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="diastolic"
                stroke="var(--chart-4)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-muted-foreground">
            No blood pressure readings available.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
