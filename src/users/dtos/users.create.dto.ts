export class UsersCreateDto {
  contact_id: number;
  login_token: string;
  ip_address: string;
  username: string;
  password: string;
  email: string;
  activation_code: string;
  forgotten_password_code: string;
  forgotten_password_time: number;
  created_on: Date;
  quota_usage: number;
  quota_limit: number; // -1 is unlimited
  quota_desc: string;
  last_login: number;
  active: number;
}
