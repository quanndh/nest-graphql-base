import {
  createParamDecorator,
  applyDecorators,
  UseGuards,
  ExecutionContext,
} from "@nestjs/common";
import { GraphQLResolveInfo } from "graphql";
import { Request, Response } from "express";
import { GqlAuthGuard } from "src/guards/gql-auth.guard";

export interface AppRequest extends Request {
  user: any;
}

type GraphqlContext = {
  req: AppRequest;
  res: Response;
};

type GraphQLExecutionContext = [any, any, GraphqlContext, GraphQLResolveInfo];

export const CurrentUser = createParamDecorator<never, ExecutionContext, any>(
  (_data, host) => {
    const [, , ctx] = host.getArgs<GraphQLExecutionContext>();
    return ctx?.req?.user;
  }
);

export const Authenticated = () => {
  return applyDecorators(UseGuards(GqlAuthGuard));
};
