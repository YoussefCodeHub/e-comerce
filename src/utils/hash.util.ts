import * as bcrypt from 'bcrypt';

const salt = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

export const hash = async (password: string): Promise<string> =>
  await bcrypt.hash(password, salt);

export const compare = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => await bcrypt.compare(password, hashedPassword);
