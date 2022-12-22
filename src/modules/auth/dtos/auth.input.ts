import { Field, InputType } from '@nestjs/graphql';
import { MinLength, Validate } from 'class-validator';
import { SNSType } from 'src/graphql/enums/auth/sns_type.enum';
import { EmailValid } from 'src/modules/users/validators/EmailValidator';

@InputType()
export class SignUpInput {
  @Field()
  name: string;

  @Field()
  @Validate(EmailValid, { message: 'Invalid email format' })
  email: string;

  @Field()
  @MinLength(6, { message: 'Password to short (more than 6 characters)' })
  password: string;
}

@InputType()
export class SNSSignUpInput {
  @Field()
  snsToken: string;

  @Field(() => SNSType)
  snsType: SNSType;
}
