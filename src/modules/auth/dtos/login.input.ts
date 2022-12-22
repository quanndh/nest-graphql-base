import { Field, InputType } from '@nestjs/graphql';
import { MinLength } from 'class-validator';

@InputType()
export class LoginInput {
  @MinLength(1)
  @Field()
  email: string;

  @Field()
  password: string;
}
