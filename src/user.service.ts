import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserInputModel } from './models/input/user.input.model';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/user.model';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>){}

  async getUsers(): Promise<UserEntity[]> {
    const users = await this.userRepository.find({})
    return users
  }

  async getUserById(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id: userId })
    if(!user){
      throw new NotFoundException('User not found')
    }
    return user
  }
  
  async createUser(user: UserInputModel): Promise<UserEntity> {
    const newUser: User = await UserEntity.createUser(user)
    const result = await this.userRepository.save(newUser)
    return result
  }

  async createUserPdf(email: string, currentUserId: string) {
    await this.validateUserByEmail(email, currentUserId)
    const user = await this.getUserByEmail(email)
    if(!user){
      throw new NotFoundException('User not found')
    }

    try {
      const doc = new PDFDocument()
      doc.fontSize(16).text(`First name: ${user.firstName}`)
      doc.fontSize(16).text(`Last name: ${user.lastName}`)

      if(user.image){
        doc.image(user.image)
      }

      let pdfBuffer = Buffer.from([]);
      doc.on('data', chunk => {
        pdfBuffer = Buffer.concat([pdfBuffer, chunk]);
      })

      await new Promise<void>(resolve => {
        doc.on('end', async () => {
          user.pdf = pdfBuffer
          await this.userRepository.save(user)
          resolve()
        })
        doc.end()
      })

      // const outputFilePath = path.join(__dirname, '../res/img', 'userPdf.pdf')
      // const outputStream = fs.createWriteStream(outputFilePath)
      // outputStream.write(user.pdf)
      // outputStream.end()

      return user
    }
    catch (error) {
      console.error('Error creating user PDF:', error)
      throw new InternalServerErrorException('Failed to create user PDF')
    }
  }

  async uploadUserImage(userId: string, metadata: Express.Multer.File, currentUserId: string) {
    await this.validateUserById(userId, currentUserId)
    const uploadPath = path.join(__dirname, '../res/img/')

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const fileName = `${userId}_${Date.now()}.png`
    fs.writeFileSync(path.join(uploadPath, fileName), metadata.buffer)

    const user = await this.getUserById(userId)
    user.image = uploadPath + fileName
    this.userRepository.save(user)

    return metadata
  }

  async updateUserFirstNameById(userId: string, newFirstName: string, currentUserId: string): Promise<boolean> {
    await this.validateUserById(userId, currentUserId)
    const updateResult = await this.userRepository.update({ id: userId }, { firstName: newFirstName })

    return updateResult.affected > 0
  }

  async updateUserLastNameById(userId: string, newLastName: string, currentUserId: string): Promise<boolean> {
    await this.validateUserById(userId, currentUserId)
    const updateResult = await this.userRepository.update({ id: userId }, { lastName: newLastName })

    return updateResult.affected > 0
  }

  async deleteUserById(userId: string, currentUserId: string): Promise<boolean> {
    await this.validateUserById(userId, currentUserId)
    const deleteResult = await this.userRepository.delete({ id: userId })

    return deleteResult.affected > 0
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ email: email })

    return user
  }

  private async validateUserById(userId: string, currentUserId: string) {
    if(userId !== currentUserId){
      throw new ForbiddenException()
    }
  }

  private async validateUserByEmail(email: string, currentUserId: string) {
    const user = await this.getUserByEmail(email)
    if(user.id !== currentUserId){
      throw new ForbiddenException()
    }
  }
}
