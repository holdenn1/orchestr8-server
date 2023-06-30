import {User} from "../entities/user.entity";

export class CreateTokenDto{
  user: User
  value: string
}