import { Controller, Get } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

@Controller()
export class AppController {
  @Get('/')
  getHello(): string {
    return 'pong';
  }
}

@Resolver()
export class AppResolver {
  @Query(() => String)
  ping() {
    return 'pong';
  }
}
