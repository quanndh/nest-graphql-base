import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { UserService } from 'src/modules/users/services/user.service';

@ValidatorConstraint({ async: true, name: 'EmailExist' })
@Injectable()
export class EmailExist implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}
  async validate(email: string) {
    return !(await this.userService.findOne({
      where: {
        email,
      },
    }));
  }

  defaultMessage() {
    return 'Email exist.';
  }
}
