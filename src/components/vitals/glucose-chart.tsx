"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useVitals } from "@/hooks/useVitals";

export function GlucoseChart() {
  const { userId } = useCurrentUser();
  const { data: vitals } = useVitals(userId ?? "");

  const glucoseSeries = (vitals ?? [])
    .filter((vital) => vital.type === "glucose")
    .map((vital) => ({
      timestamp: new Date(vital.recordedAt).getTime(),
      time: new Date(vital.recordedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      value: vital.value,
    }))
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(({ time, value }) => ({ time, value }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Glucose levels</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        {glucoseSeries.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={glucoseSeries}>
              <defs>
                <linearGradient id="glucoseFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <Tooltip formatter={(value) => [`${value} mg/dL`, "Glucose"]} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--primary)"
                strokeWidth={2}
                fill="url(#glucoseFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-muted-foreground">No glucose data available.</p>
        )}
      </CardContent>
    </Card>
  );
}

