import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { UserService } from '../user.service';

@ValidatorConstraint({ async: true })
export class UserExistValidator implements ValidatorConstraintInterface {
  constructor(private readonly userQueryRepository: UserService) {}

  async validate(userId: string) {
    const post = await this.userQueryRepository.getUserById(userId)
    return !!post
  }

  defaultMessage(args: ValidationArguments) {
    return `User with id "${args.value}" does not exist.`
  }
}