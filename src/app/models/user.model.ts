export interface User {
  id?: number; // Làm id trở thành optional
  username: string;
  email: string;
  password: string;
}

// export interface AuthResponse {
//   token: string;
//   user: User;
// }
export interface AuthResponse {
  res_code: {
    error_desc: string;
    error_code: string;
    ref_code: string | null;
    ref_desc: string | null;
  };
  data: {
    Result: string;
  };
}
