import { ApolloError } from 'apollo-server-express';
import { google } from 'googleapis';
import { SocialUser } from '../../entities/social-auth.entity';

export class GoogleAuthService {
  // constructor() {}

  async getGGUser(accessToken: string): Promise<SocialUser> {
    const oauth2Client = new google.auth.OAuth2();

    oauth2Client.setCredentials({ access_token: accessToken });

    try {
      const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: 'v2',
      });

      const res = await oauth2.userinfo.get();

      const { data } = res;

      if (!data.id || !data.email) {
        throw new ApolloError('login_google_required_email', 'login_social');
      }

      return {
        id: data.id,
        email: data?.email,
        name: data?.name,
        first_name: data?.given_name,
        last_name: data?.family_name,
      };
    } catch (err) {
      throw new ApolloError('Invalid google access token', 'invalid_token');
    }
  }
}
