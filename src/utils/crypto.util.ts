import CryptoJS from 'crypto-js';
import 'dotenv/config';

const secretKey: string = process.env.CRYPTO_SECRET_KEY!;

export const encrypt = (phone: string): string =>
  CryptoJS.AES.encrypt(phone, secretKey).toString();

export const decrypt = (encrypted: string): string =>
  CryptoJS.AES.decrypt(encrypted, secretKey).toString(CryptoJS.enc.Utf8);
