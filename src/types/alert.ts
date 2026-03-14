export type AlertSeverity = "low" | "medium" | "high";

export type Alert = {
  id: string;
  patientId: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  createdAt: string;
  acknowledged: boolean;
};
