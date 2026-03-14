export type UserRole = "patient" | "doctor";

export type UserProfile = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
};
