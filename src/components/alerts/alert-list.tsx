"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAlerts } from "@/hooks/useAlerts";
import type { AlertSeverity } from "@/types/alert";

const severityVariant: Record<AlertSeverity, "secondary" | "destructive"> = {
  low: "secondary",
  medium: "secondary",
  high: "destructive",
};

export function AlertList() {
  const { userId } = useCurrentUser();
  const { data: alerts, acknowledgeAlert } = useAlerts(userId ?? "");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clinical alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {(alerts ?? []).map((alert) => (
          <div key={alert.id} className="space-y-2 rounded-lg border border-border/60 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{alert.title}</p>
              <Badge variant={severityVariant[alert.severity]}>{alert.severity}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{alert.message}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{new Date(alert.createdAt).toLocaleString()}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  acknowledgeAlert({ id: alert.id, acknowledged: !alert.acknowledged })
                }
              >
                {alert.acknowledged ? "Reopen" : "Acknowledge"}
              </Button>
            </div>
          </div>
        ))}
        {alerts?.length ? null : (
          <p className="text-sm text-muted-foreground">No alerts at this time.</p>
        )}
      </CardContent>
    </Card>
  );
}
