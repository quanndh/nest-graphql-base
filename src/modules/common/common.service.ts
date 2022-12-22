import { Injectable } from '@nestjs/common';
import { ApolloError } from 'apollo-server-express';
import DataLoader from 'dataloader';
import { CommonRepository } from 'src/modules/common/common.repository';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  In,
  ObjectLiteral,
  SaveOptions,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class CommonService<T extends ObjectLiteral> {
  private repository: CommonRepository<T>;
  private dataloader?: DataLoader<string, T | undefined>;

  constructor(
    repo: CommonRepository<T>,
    dataloader?: DataLoader<string, T | undefined>,
  ) {
    this.repository = repo;
    if (dataloader) {
      this.dataloader = dataloader;
    }
  }

  new = (data: DeepPartial<T>) => {
    return this.repository.create(data);
  };

  save = (entity: DeepPartial<T>, options?: SaveOptions | undefined) => {
    return this.repository.save(entity, options);
  };

  create = async (data: DeepPartial<T>) => {
    const instance = this.repository.create(data);
    await this.repository.save(instance as DeepPartial<T>);

    return instance;
  };

  findAll = (options: FindManyOptions<T>) => {
    return this.repository.find(options);
  };

  count = (options: FindManyOptions<T>) => {
    return this.repository.count(options);
  };

  findAndCount = (options: FindManyOptions<T>) => {
    return this.repository.findAndCount(options);
  };

  findOne = (options: FindOneOptions<T>) => {
    return this.repository.findOne(options);
  };

  findById = (id: string, reload?: boolean) => {
    if (this.dataloader && !reload) {
      return this.dataloader.load(id);
    }
    //@ts-ignore
    return this.repository.findOneBy({ id });
  };

  findByIds(ids: string[]) {
    if (this.dataloader) {
      return this.dataloader.loadMany(ids);
    }
    //@ts-ignore
    return this.repository.findBy({
      id: In([...ids]),
    });
  }

  update = async (id: string, data: QueryDeepPartialEntity<T>) => {
    await this.repository.update(id, { ...data });
    if (this.dataloader) {
      await this.dataloader.clear(id).load(id);
    }
  };

  delete = async (id: string) => {
    try {
      await this.repository.softDelete(id);
      if (this.dataloader) {
        await this.dataloader.clear(id);
      }
    } catch (error: any) {
      throw new ApolloError(error.message);
    }
  };

  getRepository = () => this.repository;
}
