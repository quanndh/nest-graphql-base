import { Injectable } from '@nestjs/common';
import { SignUpInput, SNSSignUpInput } from 'src/modules/auth/dtos/auth.input';
import bcrypt from 'bcryptjs';
import { UserService } from 'src/modules/users/services/user.service';
import { Payload } from 'src/modules/auth/auth.interface';
import { JwtService } from '@nestjs/jwt';
import { SocialUser } from 'src/modules/auth/entities/social-auth.entity';
import { SNSType } from 'src/graphql/enums/auth/sns_type.enum';
import { GoogleAuthService } from 'src/modules/auth/libs/google/google-auth.service';
import { NaverAuthService } from 'src/modules/auth/libs/naver/naver-auth.service';
import { KakaoAuthService } from 'src/modules/auth/libs/kakao/kakao-auth.service';
import { DeepPartial } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { ApolloError } from 'apollo-server-express';

type JwtGenerateOption = {
  audience?: string | string[];
  issuer?: string;
  jwtid?: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly userSevice: UserService,
    private readonly jwtService: JwtService,
    private readonly googleAuthService: GoogleAuthService,
    private readonly naverAuthService: NaverAuthService,
    private readonly kakaoAuthService: KakaoAuthService,
  ) {}

  signUp = async (input: SignUpInput) => {
    try {
      const { password, ...rest } = input;

      const exist = await this.userSevice.findOne({
        where: { email: rest.email },
      });

      if (exist) throw new ApolloError('This email is taken');

      const salt = bcrypt.genSaltSync();
      const hashPassword = bcrypt.hashSync(password, salt);

      return await this.userSevice.create({
        ...rest,
        password: hashPassword,
        passwordSalt: salt,
      });
    } catch (error: any) {
      throw new ApolloError(error.message);
    }
  };

  login = async (email: string, password: string) => {
    try {
      const user = await this.validateUser(email, password);

      const authToken = this.saveAuthToken(user.id, user.email, {
        issuer: 'frontend',
        audience: ['app'],
      });
      if (!authToken) {
        throw new ApolloError('Error');
      }

      return {
        user,
        accessToken: authToken?.accessToken,
        refreshToken: authToken?.refreshToken,
      };
    } catch (error: any) {
      throw new ApolloError(error.message);
    }
  };

  async signUpBySocial({ snsToken, snsType }: SNSSignUpInput) {
    let socialUser: SocialUser = { id: '', email: '' };

    if (snsType === SNSType.GOOGLE) {
      socialUser = await this.googleAuthService.getGGUser(snsToken);
    } else if (snsType === SNSType.NAVER) {
      socialUser = await this.naverAuthService.getNaverUser(snsToken);
    } else if (snsType === SNSType.KAKAO) {
      socialUser = await this.kakaoAuthService.getKakaoUser(snsToken);
    }

    if (!socialUser.id) {
      throw new ApolloError('login_social_invalid', 'login_social');
    }

    const user: DeepPartial<User> = {};

    if (snsType === SNSType.GOOGLE) {
      user.goolgeId = socialUser.id;
    } else if (snsType === SNSType.NAVER) {
      user.naverId = socialUser.id;
    } else if (snsType === SNSType.KAKAO) {
      user.kakaoId = socialUser.id;
    }

    const exist = await this.userSevice.findOne({
      where: { email: socialUser.email },
    });

    if (exist) {
      await this.userSevice.update(exist.id, { ...user });
    } else {
      user.name = socialUser.name ?? 'username';
      user.email = socialUser.email;
      user.avatar = socialUser.avatar ?? undefined;

      return await this.userSevice.create({ ...user });
    }
    return await this.userSevice.findById(exist.id);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userSevice.findOne({ where: { email } });
    if (!user || !bcrypt.compareSync(password, user.password ?? '')) {
      throw new ApolloError('Your email or password is incorretly');
    }

    return user;
  }

  saveAuthToken(userId: string, email: string, options?: JwtGenerateOption) {
    const { accessToken, refreshToken } = this.initAccessToken({
      payload: {
        sub: userId,
        email,
      },
      options,
    });
    return { accessToken, refreshToken };
  }

  initAccessToken(data: { payload: Payload; options?: JwtGenerateOption }) {
    const { payload, options } = data;
    return {
      accessToken: this.jwtService.sign(payload, {
        ...options,
        expiresIn: `30 days`,
      }),
      refreshToken: this.jwtService.sign(payload, {
        ...options,
        expiresIn: `35 days`,
      }),
    };
  }
}
