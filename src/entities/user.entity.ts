import { User } from "../models/user.model"
import { generateHash } from "../helpers/generateHash"
import { UserInputModel } from "../models/input/user.input.model"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"


@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string
  @Column()
  firstName: string
  @Column()
  lastName: string
  @Column()
  password: string
  @Column()
  email: string
  @Column({ nullable: true })
  image: string
  @Column({ type: 'bytea', nullable: true })
  pdf: Buffer

  public static async createUser(userDto: UserInputModel): Promise<User> {
    const passwordHash = await generateHash(userDto.password)
    const newUser: User = {...userDto, password: passwordHash }

    return newUser
  }
}
