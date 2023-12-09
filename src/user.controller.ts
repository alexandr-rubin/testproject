import { Body, Controller, Delete, Get, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { UserInputModel } from './models/input/user.input.model';
import { UserIdValidationPipe } from './validation/pipes/user-id-validation.pipe';
import { EmailExistsPipe } from './validation/pipes/email-exist.pipe';
import { UserNameInputModel } from './models/input/user-name.input.model';
import { UserImageValidationPipe } from './validation/pipes/user-image-validation.pipe';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { UserEmailInputModel } from './models/input/user-email.input.model';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AccessTokenVrifyModel } from './models/Auth';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    return await this.userService.getUsers()
  }

  @Get(':userId')
  async getUserById(@Param('userId', UserIdValidationPipe) userId: string) {
    return await this.userService.getUserById(userId)
  }

  @Post()
  async createUser(@Body(EmailExistsPipe) user: UserInputModel) {
    return await this.userService.createUser(user)
  }

  @UseGuards(JwtAuthGuard)
  @Post('pdf')
  async createUserPdf(@Body() email: UserEmailInputModel, @Req() req: AccessTokenVrifyModel) {
    return await this.userService.createUserPdf(email.email, req.user.userId)
  }

  @UseGuards(JwtAuthGuard)
  @Post('img/:userId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadUserImage(@Param('userId', UserIdValidationPipe) userId: string, @UploadedFile(UserImageValidationPipe) metadata: Express.Multer.File, @Req() req: AccessTokenVrifyModel) {
    return await this.userService.uploadUserImage(userId, metadata, req.user.userId)
  }

  @UseGuards(JwtAuthGuard)
  @Put('firstname/:userId')
  async updateUserFirstNameById(@Param('userId', UserIdValidationPipe) userId: string, @Body() firstName: UserNameInputModel, @Req() req: AccessTokenVrifyModel) {
    return await this.userService.updateUserFirstNameById(userId, firstName.newName, req.user.userId)
  }

  @UseGuards(JwtAuthGuard)
  @Put('lastname/:userId')
  async updateUserLastNameById(@Param('userId', UserIdValidationPipe) userId: string, @Body() firstName: UserNameInputModel, @Req() req: AccessTokenVrifyModel) {
    return await this.userService.updateUserLastNameById(userId, firstName.newName, req.user.userId)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':userId')
  async deleteUserById(@Param('userId', UserIdValidationPipe) userId: string, @Req() req: AccessTokenVrifyModel) {
    return await this.userService.deleteUserById(userId, req.user.userId)
  }
}
