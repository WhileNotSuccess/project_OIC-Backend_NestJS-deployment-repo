interface StaffResponse {
  name: string;
  position: string;
  phone: string;
  email: string;
  team: string;
  role: string;
  id: number;
}

interface StaffResponseForAdmin {
  name: string;
  position: string;
  phone: string;
  email: string;
  team: string;
  position_jp: string;
  team_jp: string;
  position_en: string;
  team_en: string;
  role: string;
  role_en: string;
  role_jp: string;
  id: number;
}

export interface StaffResMessage {
  message: string;
  data: { [key: string]: StaffResponse[] };
}

export interface StaffResMessageForAdmin {
  message: string;
  data: { [key: string]: StaffResponseForAdmin[] };
}
