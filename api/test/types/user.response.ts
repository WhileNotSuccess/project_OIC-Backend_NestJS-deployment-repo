export interface UserResponse {
  message: string;
}
export interface User {
  id: number;
  name: string;
  email: string;
  createDate: Date;
}
export interface AdminCheckResponse {
  message: string;
  result: boolean;
}
export interface UserInfoResponse {
  message: string;
  userInfo: User;
}
export interface UsersInfoResponse {
  message: string;
  data: User[];
}
