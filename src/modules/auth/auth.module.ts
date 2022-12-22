import { Global, Module } from '@nestjs/common';
import { AuthMutationResolver } from 'src/modules/auth/resolvers/auth.mutation';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { UserModule } from 'src/modules/users/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy';
import { NaverAuthService } from 'src/modules/auth/libs/naver/naver-auth.service';
import { KakaoAuthService } from 'src/modules/auth/libs/kakao/kakao-auth.service';
import { GoogleAuthService } from 'src/modules/auth/libs/google/google-auth.service';

@Global()
@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: 'abc',
      signOptions: { expiresIn: '30 days', issuer: 'frontend' },
    }),
  ],
  providers: [
    AuthMutationResolver,
    JwtStrategy,
    AuthService,
    NaverAuthService,
    GoogleAuthService,
    KakaoAuthService,
  ],
})
export class AuthModule {}
