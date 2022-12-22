import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { User } from 'src/modules/users/entities/user.entity';
import { UserRepository } from 'src/modules/users/repositories/user.repository';

@Injectable({
  scope: Scope.REQUEST,
})
export class UserDataloader extends DataLoader<string, User | undefined> {
  constructor(private readonly userRepository: UserRepository) {
    super(async (ids: ReadonlyArray<string>) => {
      const rows = await this.userRepository.findByIds([...ids]);
      return ids.map((id) => rows.find((x) => x.id == id) || undefined);
    });
  }
}
