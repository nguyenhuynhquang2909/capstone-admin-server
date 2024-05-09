export interface JwtPayload {
  userId: number;
  issuedAt: string;
  expiresAt: string;
  roleId?: number;
}
