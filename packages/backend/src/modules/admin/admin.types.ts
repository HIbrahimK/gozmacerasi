export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalChildren: number;
  totalDoctors: number;
  totalGames: number;
  totalSessions: number;
  totalPremiumCodes: number;
  activePremiumCodes: number;
  todaySessions: number;
}

export interface AdminUserDetail extends AdminUser {
  parentProfile: {
    id: string;
    phone: string | null;
    childrenCount: number;
  } | null;
  doctorProfile: {
    id: string;
    specialization: string | null;
    licenseNumber: string | null;
    verified: boolean;
    patientsCount: number;
  } | null;
  adminProfile: {
    id: string;
  } | null;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: string;
}
