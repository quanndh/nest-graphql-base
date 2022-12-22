import { Field, ObjectType } from '@nestjs/graphql';
import { PaginationBase } from 'src/graphql/types/common.interface.entity';
import { UUIDEntity } from 'src/modules/common/base-entity';
import { Column, Entity, Unique } from 'typeorm';

@ObjectType()
@Entity({
  name: 'users',
})
@Unique('user_email_uniq', ['email'])
export class User extends UUIDEntity {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  passwordSalt?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  goolgeId?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  naverId?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  kakaoId?: string;

  @Field({ nullable: true })
  @Field()
  @Column({ default: false })
  isVerify: boolean;
}

@ObjectType()
export class UserConnection extends PaginationBase(User) {}
