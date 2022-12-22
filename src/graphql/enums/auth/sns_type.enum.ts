import { registerEnumType } from '@nestjs/graphql';

export enum SNSType {
  GOOGLE = 'GOOGLE',
  KAKAO = 'KAKAO',
  NAVER = 'NAVER',
}
registerEnumType(SNSType, {
  name: 'SNSType',
});
