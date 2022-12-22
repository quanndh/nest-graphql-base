import {
  EntityRepository,
  Repository,
  FindManyOptions,
  SelectQueryBuilder,
} from 'typeorm';
import { PaginationArgs } from 'src/graphql/types/common.args';
import { Pagination } from './pagination';
import {
  createPaginationObject,
  resolveOptions,
} from 'src/helpers/resolve-pagination';

@EntityRepository()
export class CommonRepository<Model> extends Repository<Model> {
  async paginate(
    data: PaginationArgs,
    searchOptions?: FindManyOptions<Model>,
    cb?: (val: FindManyOptions<Model>) => FindManyOptions<Model>,
  ): Promise<Pagination<Model>> {
    const { page, limit, query } = resolveOptions(data);

    let where = {};
    if (searchOptions && searchOptions.where) {
      where = searchOptions.where;
    }
    where = { ...where, ...query };
    const options = cb
      ? cb({ ...searchOptions, where })
      : { ...searchOptions, where };

    const [items, total] = await this.findAndCount({
      skip: limit * (page - 1),
      take: limit,
      ...options,
    });
    return createPaginationObject<Model>(items, total, page, limit);
  }

  async paginateQueryBuilder(
    queryBuilder: SelectQueryBuilder<Model>,
    options: PaginationArgs,
  ): Promise<Pagination<Model>> {
    const { page, limit } = resolveOptions(options);

    const [items, total] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return createPaginationObject<Model>(items, total, page, limit);
  }
}
