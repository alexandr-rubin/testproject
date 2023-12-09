import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { UserInputModel } from '../../models/input/user.input.model';
import { UserService } from '../../user.service';

@Injectable()
export class EmailExistsPipe implements PipeTransform {
  constructor(private readonly userService: UserService) {}

  async transform(value: UserInputModel) {
    if (!value.email) {
      throw new BadRequestException('Email must be provided.')
    }

    if (value.email) {
      const emailExists = await this.userService.getUserByEmail(value.email);
      if (emailExists) {
        throw new BadRequestException('Email is already taken.')
      }
    }

    return value
  }
}
