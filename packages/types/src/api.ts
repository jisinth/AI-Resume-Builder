export interface ApiErrorBody {
  statusCode: number;
  message: string;
  error: string;
  path: string;
  timestamp: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface DashboardStats {
  totalResumes: number;
  totalApplications: number;
  averageAtsScore: number | null;
  interviewCount: number;
  profileCompletion: number;
}
