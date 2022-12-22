import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';
import { SortInput } from './common.input';
import { GraphQLJSONObject } from 'graphql-type-json';

@ArgsType()
@InputType()
export class PaginationArgs {
  @Field(() => Int, {
    defaultValue: 15,
  })
  limit?: number;

  @Field(() => Int, {
    defaultValue: 1,
  })
  page?: number;

  sort?: SortInput;

  @Field(() => [GraphQLJSONObject])
  filters?: any[];
  s?: string;
}

@ArgsType()
@InputType()
export class BasePaginationArgs {
  @Field(() => Int, {
    defaultValue: 20,
  })
  limit: number;

  @Field(() => Int, {
    defaultValue: 1,
  })
  page: number;
}
