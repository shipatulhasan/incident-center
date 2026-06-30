export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface JwtPayload {
  id: string;
  role: string;
}