import { PipeTransform, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginInputModel } from '../../models/input/login.input.model';
import { UserService } from '../../user.service';

@Injectable()
export class LoginValidationPipe implements PipeTransform {
  constructor(private readonly userService: UserService) {}

  async transform(value: LoginInputModel) {

    const user = await this.userService.getUserByEmail(value.email)

    if (!user) {
      throw new UnauthorizedException('User with the specified email not found.')
    }
    
    return value
  }
}
