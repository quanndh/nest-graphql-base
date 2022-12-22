export type AuthModuleOptions = {
  secret?: string;
};
export type Payload = {
  email: string;
  sub: string;
};

export type JWTDecodeValue = {
  iat: number;
  exp: number;
  iss?: string;
  aud?: string | string[];
} & Payload;
