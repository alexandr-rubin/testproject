import { IsString, Length, Matches } from "class-validator"

export class UserNameInputModel {
    @IsString()
    @Length(3, 10)
    @Matches(/^[a-zA-Z0-9_-]*$/, {
      message: 'Only alphanumeric characters, underscores, and hyphens are allowed',
    })
    newName!: string
  }