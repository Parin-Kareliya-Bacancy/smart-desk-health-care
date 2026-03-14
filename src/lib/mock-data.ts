import type { Alert } from "@/types/alert";
import type { Appointment } from "@/types/appointment";
import type { Medication } from "@/types/medication";
import type { VitalReading } from "@/types/vitals";
import type { UserProfile } from "@/types/user";

export const mockUsers: UserProfile[] = [
  {
    id: "patient-1",
    email: "patient@chronocare.ai",
    fullName: "Avery Patel",
    role: "patient",
  },
  {
    id: "doctor-1",
    email: "doctor@chronocare.ai",
    fullName: "Dr. Morgan Rivera",
    role: "doctor",
  },
];

export const mockVitals: VitalReading[] = [
  {
    id: "vital-1",
    patientId: "patient-1",
    type: "heart_rate",
    value: 72,
    unit: "bpm",
    recordedAt: "2026-03-14T06:00:00.000Z",
  },
  {
    id: "vital-2",
    patientId: "patient-1",
    type: "blood_pressure",
    value: 118,
    unit: "mmHg",
    recordedAt: "2026-03-14T06:05:00.000Z",
  },
  {
    id: "vital-3",
    patientId: "patient-1",
    type: "blood_pressure",
    value: 76,
    unit: "mmHg",
    recordedAt: "2026-03-14T06:05:00.000Z",
  },
  {
    id: "vital-4",
    patientId: "patient-1",
    type: "oxygen",
    value: 98,
    unit: "%",
    recordedAt: "2026-03-14T06:10:00.000Z",
  },
  {
    id: "vital-5",
    patientId: "patient-1",
    type: "temperature",
    value: 98.6,
    unit: "F",
    recordedAt: "2026-03-14T06:15:00.000Z",
  },
  {
    id: "vital-6",
    patientId: "patient-1",
    type: "weight",
    value: 172,
    unit: "lb",
    recordedAt: "2026-03-14T06:20:00.000Z",
  },
  {
    id: "vital-7",
    patientId: "patient-1",
    type: "glucose",
    value: 124,
    unit: "mg/dL",
    recordedAt: "2026-03-14T06:30:00.000Z",
  },
  {
    id: "vital-8",
    patientId: "patient-1",
    type: "glucose",
    value: 142,
    unit: "mg/dL",
    recordedAt: "2026-03-14T10:00:00.000Z",
  },
  {
    id: "vital-9",
    patientId: "patient-1",
    type: "blood_pressure",
    value: 122,
    unit: "mmHg",
    recordedAt: "2026-03-14T12:00:00.000Z",
  },
  {
    id: "vital-10",
    patientId: "patient-1",
    type: "blood_pressure",
    value: 78,
    unit: "mmHg",
    recordedAt: "2026-03-14T12:00:00.000Z",
  },
  {
    id: "vital-11",
    patientId: "patient-1",
    type: "glucose",
    value: 136,
    unit: "mg/dL",
    recordedAt: "2026-03-14T14:30:00.000Z",
  },
  {
    id: "vital-12",
    patientId: "patient-1",
    type: "blood_pressure",
    value: 116,
    unit: "mmHg",
    recordedAt: "2026-03-14T18:00:00.000Z",
  },
  {
    id: "vital-13",
    patientId: "patient-1",
    type: "blood_pressure",
    value: 74,
    unit: "mmHg",
    recordedAt: "2026-03-14T18:00:00.000Z",
  },
  {
    id: "vital-14",
    patientId: "patient-1",
    type: "glucose",
    value: 128,
    unit: "mg/dL",
    recordedAt: "2026-03-14T18:30:00.000Z",
  },
];

export const mockMedications: Medication[] = [
  {
    id: "med-1",
    patientId: "patient-1",
    name: "Metformin",
    dosage: "500 mg",
    frequency: "Twice daily",
    nextDoseAt: "2026-03-14T12:00:00.000Z",
    isActive: true,
  },
  {
    id: "med-2",
    patientId: "patient-1",
    name: "Atorvastatin",
    dosage: "20 mg",
    frequency: "Every evening",
    nextDoseAt: "2026-03-14T20:00:00.000Z",
    isActive: true,
  },
];

export const mockAlerts: Alert[] = [
  {
    id: "alert-1",
    patientId: "patient-1",
    title: "Elevated blood pressure",
    message: "Systolic reading above threshold for 3 days.",
    severity: "high",
    createdAt: "2026-03-13T18:00:00.000Z",
    acknowledged: false,
  },
  {
    id: "alert-2",
    patientId: "patient-1",
    title: "Medication adherence",
    message: "Missed one dose of Metformin yesterday.",
    severity: "medium",
    createdAt: "2026-03-13T16:30:00.000Z",
    acknowledged: true,
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: "appt-1",
    patientId: "patient-1",
    title: "Cardiology follow-up",
    provider: "Dr. Morgan Rivera",
    scheduledAt: "2026-03-15T09:30:00.000Z",
    location: "Rivera Heart Clinic",
    status: "scheduled",
  },
  {
    id: "appt-2",
    patientId: "patient-1",
    title: "Nutrition check-in",
    provider: "Rina Chen, RD",
    scheduledAt: "2026-03-18T13:00:00.000Z",
    location: "Telehealth",
    status: "scheduled",
  },
  {
    id: "appt-3",
    patientId: "patient-1",
    title: "Labs & diagnostics",
    provider: "ChronoCare Lab",
    scheduledAt: "2026-03-22T08:00:00.000Z",
    location: "Downtown Lab",
    status: "scheduled",
  },
];
