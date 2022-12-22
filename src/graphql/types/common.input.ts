import { Field, InputType } from '@nestjs/graphql';
import {
  FilterOperatorTypeEnum,
  FilterFieldTypeEnum,
} from 'src/graphql/enums/commons/filter_operator.enum';

@InputType()
export class FilterInput {
  @Field()
  field: string;

  @Field(() => FilterOperatorTypeEnum)
  operator: FilterOperatorTypeEnum;

  @Field(() => FilterFieldTypeEnum, {
    defaultValue: FilterFieldTypeEnum.STRING,
  })
  type: FilterFieldTypeEnum;

  @Field()
  value: string;
}

@InputType()
export class SortInput {
  @Field()
  field: string;
  @Field()
  direction?: string;
}
