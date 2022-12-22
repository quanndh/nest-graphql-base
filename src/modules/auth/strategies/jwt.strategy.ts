import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Strategy } from 'passport-http-bearer';
import { User } from 'src/modules/users/entities/user.entity';
import { Connection } from 'typeorm';
import jwtDecode from 'jwt-decode';
import { JWTDecodeValue } from 'src/modules/auth/auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private connection: Connection) {
    super({
      jwtFromRequest: (req: Request) => {
        return (
          (req.cookies.token as string) ??
          req.headers.authorization?.split(' ')[1] ??
          req.query.access_token
        );
      },
      ignoreExpiration: true,
      passReqToCallback: true,
    });
  }

  validate = async (req: Request) => {
    const accessToken = req.headers.authorization?.split(' ')[1];
    if (!accessToken) {
      throw new UnauthorizedException();
    }
    try {
      const user = this.getUserByToken(accessToken);
      if (!user) {
        throw new UnauthorizedException(
          'Token không hợp lệ hoặc phiên làm việc đã hết hạn',
        );
      }
      return user;
    } catch (err) {
      throw new UnauthorizedException(
        'Token không hợp lệ hoặc phiên làm việc đã hết hạn',
      );
    }
  };

  async getUserByToken(token: string) {
    const decode = jwtDecode<JWTDecodeValue>(token);
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.findOne(User, {
        where: {
          email: decode.email,
        },
      });
      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
