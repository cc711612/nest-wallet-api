import * as crypto from 'crypto';

const algorithm = 'aes-256-cbc';

const encryptionKey = process.env.ENCRYPTION_KEY;
const encryptionIv = process.env.ENCRYPTION_IV;

if (!encryptionKey || encryptionKey.length !== 64) {
  throw new Error('Invalid ENCRYPTION_KEY length. It should be 64 hex characters (32 bytes).');
}

if (!encryptionIv || encryptionIv.length !== 32) {
  throw new Error('Invalid ENCRYPTION_IV length. It should be 32 hex characters (16 bytes).');
}

const key = Buffer.from(encryptionKey, 'hex');
const iv = Buffer.from(encryptionIv, 'hex');

export function encrypt(text: string): string {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export function decrypt(encrypted: string): string {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}