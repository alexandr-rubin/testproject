import { IsString, Length, Matches } from "class-validator";

export class LoginInputModel {
  @IsString()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'Invalid email format',
  })
  email!: string
  @IsString()
  @Length(6, 20)
  password: string
}