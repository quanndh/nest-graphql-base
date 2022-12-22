import { CommonRepository } from 'src/modules/common/common.repository';
import { User } from 'src/modules/users/entities/user.entity';
import { EntityRepository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends CommonRepository<User> {}
