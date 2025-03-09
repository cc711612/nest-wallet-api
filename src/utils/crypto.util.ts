import * as crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const key = crypto.createHash('sha256').update(String(process.env.ENCRYPTION_KEY)).digest('base64').substr(0, 32);

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const ivBase64 = iv.toString('base64');
  const mac = crypto.createHmac('sha256', key).update(ivBase64 + encrypted).digest('base64');
  const json = JSON.stringify({ iv: ivBase64, value: encrypted, mac: mac, tag: '' });
  return Buffer.from(json).toString('base64');
}

export function decrypt(text: string): string {
  const json = Buffer.from(text, 'base64').toString('utf8');
  const { iv, value, mac } = JSON.parse(json);
  const ivBuffer = Buffer.from(iv, 'base64');
  const decipher = crypto.createDecipheriv(algorithm, key, ivBuffer);
  let decrypted = decipher.update(value, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}