export type AppointmentStatus = "scheduled" | "completed" | "cancelled";

export type Appointment = {
  id: string;
  patientId: string;
  title: string;
  provider: string;
  scheduledAt: string;
  location: string;
  status: AppointmentStatus;
};
