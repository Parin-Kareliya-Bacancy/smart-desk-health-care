export type VitalType =
  | "heart_rate"
  | "blood_pressure"
  | "glucose"
  | "weight"
  | "temperature"
  | "oxygen";

export type VitalReading = {
  id: string;
  patientId: string;
  type: VitalType;
  value: number;
  unit: string;
  recordedAt: string;
};
