import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { REGEXG } from '../../../helpers/regexp';

@ValidatorConstraint({ name: 'emailValid', async: false })
export class EmailValid implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return REGEXG.email.test(text.trim());
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return 'Invalid email format.';
  }
}
