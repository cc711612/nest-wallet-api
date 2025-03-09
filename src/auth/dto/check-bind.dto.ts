export class CheckBindDto {
  constructor(
    public username: string,
    public thirdPartyId: string,
    public provider: string,  // 例如：'google', 'facebook' 等
  ) {}
} 