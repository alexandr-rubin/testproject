import { IsString, Matches } from "class-validator"

export class UserEmailInputModel {
    @IsString()
    @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
      message: 'Invalid email format',
    })
    email!: string
  }