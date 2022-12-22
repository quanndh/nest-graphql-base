import axios from 'axios';
import { NAVER_DOMAIN } from './naver.constants';
import { NaverUser } from './naver.interface';
import { SocialUser } from '../../entities/social-auth.entity';
import { ApolloError } from 'apollo-server-express';

export class NaverAuthService {
  // constructor() {}

  async getNaverUser(accessToken: string): Promise<SocialUser> {
    try {
      const res = await axios.get<{ response: NaverUser }>(NAVER_DOMAIN, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      });

      if (res.status !== 200) {
        throw new ApolloError('login_naver_failure', 'login_social');
      }

      const {
        data: {
          // resultcode,
          response: { id, email, ...user },
        },
      } = res;

      return {
        id,
        email,
        ...user,
      };
    } catch (err) {
      throw new ApolloError('login_naver_failure', 'login_social');
    }
  }
}
