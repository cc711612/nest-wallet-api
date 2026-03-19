import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { randomBytes } from 'crypto';

type ExpiringValue<T> = {
  value: T;
  expiresAt: number;
};

@Injectable()
export class SocialService {
  private readonly bindTokenCache = new Map<string, ExpiringValue<{ userId: number }>>();
  private readonly registerTokenCache = new Map<string, ExpiringValue<{ socialId: number }>>();

  constructor(private readonly dataSource: DataSource) {}

  async checkBind(payload: {
    socialType: number;
    socialTypeValue: string;
    name?: string;
    email?: string;
    image?: string;
    token?: string;
  }) {
    const socialType = Number(payload.socialType || 0);
    const socialTypeValue = payload.socialTypeValue;

    const rows = await this.dataSource.query(
      `SELECT s.id, us.user_id
       FROM socials s
       LEFT JOIN user_social us ON us.social_id = s.id
       WHERE s.social_type = ? AND s.social_type_value = ?
       LIMIT 1`,
      [socialType, socialTypeValue],
    );

    const token = this.makeToken();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    if (rows.length > 0 && Number(rows[0]?.user_id || 0) > 0) {
      this.bindTokenCache.set(this.bindTokenKey(socialType, token), {
        value: { userId: Number(rows[0].user_id) },
        expiresAt,
      });
      return { action: 'bind', token };
    }

    await this.dataSource.query(
      `INSERT INTO socials (social_type, social_type_value, name, email, image, token, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         email = VALUES(email),
         image = VALUES(image),
         token = VALUES(token),
         updated_at = NOW()`,
      [socialType, socialTypeValue, payload.name ?? '', payload.email ?? '', payload.image ?? '', payload.token ?? ''],
    );

    const upserted = await this.dataSource.query(
      `SELECT id FROM socials WHERE social_type = ? AND social_type_value = ? LIMIT 1`,
      [socialType, socialTypeValue],
    );

    this.registerTokenCache.set(token, {
      value: { socialId: Number(upserted?.[0]?.id || 0) },
      expiresAt,
    });

    return { action: 'not bind', token };
  }

  consumeBindTokenUserId(socialType: number, token: string): number {
    const key = this.bindTokenKey(socialType, token);
    const cached = this.bindTokenCache.get(key);
    if (!cached || cached.expiresAt < Date.now()) {
      this.bindTokenCache.delete(key);
      return 0;
    }
    this.bindTokenCache.delete(key);
    return cached.value.userId;
  }

  async bind(payload: { token: string; user: { id: number } }) {
    const token = payload.token;
    const userId = Number(payload.user?.id || 0);
    const cached = this.registerTokenCache.get(token);
    if (!cached || cached.expiresAt < Date.now() || userId <= 0 || cached.value.socialId <= 0) {
      this.registerTokenCache.delete(token);
      throw new Error('token is invalid');
    }
    this.registerTokenCache.delete(token);

    const updateResult = await this.dataSource.query(
      `UPDATE user_social SET user_id = ? WHERE social_id = ?`,
      [userId, cached.value.socialId],
    );

    if (!updateResult || Number(updateResult.affectedRows || 0) === 0) {
      await this.dataSource.query(`INSERT INTO user_social (social_id, user_id) VALUES (?, ?)`, [
        cached.value.socialId,
        userId,
      ]);
    }
  }

  async unBind(payload: { socialType: number; user: { id: number } }) {
    const userId = Number(payload.user?.id || 0);
    const socialType = Number(payload.socialType || 0);
    if (userId <= 0 || socialType <= 0) {
      return;
    }

    await this.dataSource.query(
      `DELETE us
       FROM user_social us
       INNER JOIN socials s ON s.id = us.social_id
       WHERE us.user_id = ? AND s.social_type = ?`,
      [userId, socialType],
    );
  }

  private makeToken(): string {
    return randomBytes(9).toString('base64url').slice(0, 12);
  }

  private bindTokenKey(socialType: number, token: string): string {
    return `${socialType}:${token}`;
  }
}
