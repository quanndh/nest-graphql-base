import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/modules/common/common.service';
import { UserDataloader } from 'src/modules/users/dataloaders/user.dataloader';
import { User } from 'src/modules/users/entities/user.entity';
import { UserRepository } from 'src/modules/users/repositories/user.repository';

@Injectable()
export class UserService extends CommonService<User> {
  constructor(private readonly userRepostory: UserRepository, private readonly userDataloader: UserDataloader) {
    super(userRepostory, userDataloader);
  }
}
