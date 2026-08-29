import { User } from './user.interface';

export interface RegisterResponse {
  user: User;
  message: string;
  jwt: string;
  status: boolean;
}
