import * as argon2 from "argon2";

export default class HashHelper {
  static async hash(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  static async verify(
    hashedPassword: string,
    plainPassword: string
  ): Promise<boolean> {
    try {
      return await argon2.verify(hashedPassword, plainPassword);
    } catch (err) {
      return false;
    }
  }
}
