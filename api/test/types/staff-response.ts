export interface StaffResponse {
  id: number;
  name: string;
  phoneNumber: string;
  role: string;
}

export interface StaffResMessage {
  message: string;
  data: StaffResponse[];
}
