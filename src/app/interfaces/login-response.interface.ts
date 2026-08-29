import { User } from './user.interface';

export interface LoginResponse {
  user: User;
  message: string;
  jwt: string;
  status: boolean;
}
