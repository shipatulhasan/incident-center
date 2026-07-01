interface TLoginPayload {
  email: string;
  password: string;
}

interface TLoginResponse {
  success: boolean,
    statusCode: number,
    message:string,
    data?: T,
}