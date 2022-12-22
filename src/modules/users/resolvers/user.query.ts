import { Args, Query, Resolver } from '@nestjs/graphql';
import { Authenticated, CurrentUser } from 'src/decorators/common.decorator';
import { User } from 'src/modules/users/entities/user.entity';
import { UserService } from 'src/modules/users/services/user.service';

@Resolver(() => User)
export class UserQueryResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, {
    description: 'Get current user infomation',
  })
  @Authenticated()
  me(@CurrentUser() user: User) {
    return user;
  }

  @Query(() => User, { nullable: true })
  user(@Args('id') id: string) {
    return this.userService.findById(id);
  }
}
