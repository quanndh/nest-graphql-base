import { ExecutionContext, Injectable, Scope } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { GraphQLContext } from 'src/graphql/app.graphql-context';

@Injectable({ scope: Scope.REQUEST })
export class GqlAuthGuard extends AuthGuard('bearer') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context).getContext<{
      req: Request;
    }>();
    return ctx.req;
  }
}

@Injectable()
export class GqlCookieAuthGuard extends AuthGuard('cookie') {
  getRequest(context: ExecutionContext) {
    const ctx: GraphQLContext =
      GqlExecutionContext.create(context).getContext();
    return ctx.req;
  }
}
