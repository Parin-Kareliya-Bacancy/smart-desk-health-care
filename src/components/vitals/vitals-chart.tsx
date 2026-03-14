"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useVitals } from "@/hooks/useVitals";

export function VitalsChart() {
  const { userId } = useCurrentUser();
  const { data: vitals } = useVitals(userId ?? "");

  const heartRateSeries = (vitals ?? [])
    .filter((vital) => vital.type === "heart_rate")
    .map((vital) => ({
      time: new Date(vital.recordedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      value: vital.value,
    }))
    .reverse();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Heart rate trend</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        {heartRateSeries.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={heartRateSeries}>
              <XAxis dataKey="time" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-muted-foreground">
            No heart rate data available.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
