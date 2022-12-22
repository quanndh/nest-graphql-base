import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SignUpInput, SNSSignUpInput } from 'src/modules/auth/dtos/auth.input';
import { LoginInput } from 'src/modules/auth/dtos/login.input';
import { AuthConnection } from 'src/modules/auth/entities/auth.entity';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { User } from 'src/modules/users/entities/user.entity';

@Resolver()
export class AuthMutationResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User, {
    description: 'Signup with email',
  })
  signUp(@Args('input') input: SignUpInput) {
    return this.authService.signUp(input);
  }

  @Mutation(() => AuthConnection, {
    description: 'Login with email',
  })
  async login(
    @Args('input', { type: () => LoginInput, nullable: false })
    input: LoginInput,
  ) {
    const data = await this.authService.login(input.email, input.password);
    return data;
  }

  @Mutation(() => User, {
    description: 'Signup by social.',
  })
  async signUpBySocial(@Args('input') input: SNSSignUpInput) {
    return await this.authService.signUpBySocial(input);
  }
}
