import { SNSType } from 'src/graphql/enums/auth/sns_type.enum';

export interface ISocialUser {
  id: string;
  email?: string;
  phone_number?: string | null;
  name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  avatar?: string | null;
}

export interface SocialProvider {
  provider: SNSType;
  providerId: string;
}
