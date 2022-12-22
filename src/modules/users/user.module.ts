import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDataloader } from 'src/modules/users/dataloaders/user.dataloader';
import { User } from 'src/modules/users/entities/user.entity';
import { UserRepository } from 'src/modules/users/repositories/user.repository';
import { UserQueryResolver } from 'src/modules/users/resolvers/user.query';
import { UserService } from 'src/modules/users/services/user.service';
import { EmailValid } from 'src/modules/users/validators/EmailValidator';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRepository])],
  providers: [UserService, EmailValid, UserDataloader, UserQueryResolver],
  exports: [UserService, EmailValid],
})
export class UserModule {}
