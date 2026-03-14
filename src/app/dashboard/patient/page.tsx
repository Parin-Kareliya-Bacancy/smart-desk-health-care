import { UpcomingAppointments } from "@/components/appointments/upcoming-appointments";
import { PatientVitalsToday } from "@/components/dashboard/patient-vitals-today";
import { MedicationReminders } from "@/components/medications/medication-reminders";
import { BloodPressureChart } from "@/components/vitals/blood-pressure-chart";
import { GlucoseChart } from "@/components/vitals/glucose-chart";
import { VitalSignForm } from "@/components/vitals/vital-form";

export default function PatientDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Patient dashboard</p>
          <h2 className="text-3xl font-semibold tracking-tight">
            Personalized care overview
          </h2>
        </div>
        <div className="rounded-xl border border-border/60 bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
          Supabase-connected insights, refreshed automatically.
        </div>
      </div>
      <PatientVitalsToday />
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <VitalSignForm />
          <div className="grid gap-6 md:grid-cols-2">
            <GlucoseChart />
            <BloodPressureChart />
          </div>
        </div>
        <div className="space-y-6">
          <MedicationReminders />
          <UpcomingAppointments />
        </div>
      </div>
    </div>
  );
}
