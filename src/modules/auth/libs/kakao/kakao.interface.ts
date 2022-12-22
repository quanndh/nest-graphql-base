export interface KakaoUser {
  id: string;
  properties: any;
  kakao_account: KakaoAccount;
}

export interface KakaoAccount {
  email: string;
  phone_number: string;
  profile: KakaoProfile;
}

export interface KakaoProfile {
  nickname: string;
}
