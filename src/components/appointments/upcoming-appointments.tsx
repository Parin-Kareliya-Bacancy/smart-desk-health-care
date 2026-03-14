"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAppointments } from "@/hooks/useAppointments";
import type { AppointmentStatus } from "@/types/appointment";
import { CalendarDays, MapPin } from "lucide-react";

const statusVariant: Record<AppointmentStatus, "secondary" | "outline" | "destructive"> = {
  scheduled: "secondary",
  completed: "outline",
  cancelled: "destructive",
};

function formatDate(timestamp: string) {
  return new Date(timestamp).toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function UpcomingAppointments() {
  const { userId } = useCurrentUser();
  const { data: appointments } = useAppointments(userId ?? "");

  const upcoming = (appointments ?? [])
    .filter(
      (appointment) =>
        Boolean(appointment.scheduledAt) &&
        new Date(appointment.scheduledAt).getTime() >= Date.now()
    )
    .slice(0, 3);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Upcoming appointments</CardTitle>
          <p className="text-sm text-muted-foreground">
            Scheduled visits and check-ins over the next two weeks.
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcoming.map((appointment) => (
          <div
            key={appointment.id}
            className="rounded-lg border border-border/60 p-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{appointment.title}</p>
              <Badge variant={statusVariant[appointment.status]}>
                {appointment.status}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {appointment.provider}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatDate(appointment.scheduledAt)} at{" "}
                {formatTime(appointment.scheduledAt)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {appointment.location}
              </span>
            </div>
          </div>
        ))}
        {upcoming.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No upcoming appointments scheduled.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
