import redisClient from '../config/redisClient';
import { v4 as uuidv4 } from 'uuid';
import { hashPassword } from '../utils/hashHelper';

export class AuthService {
  private userKeyPrefix = 'user_';

  registerUser = async (email: string, password: string) => {
    const userKey = `${this.userKeyPrefix}${email}`;
    const isUserRegistered = await redisClient.get(userKey);

    if (isUserRegistered) {
      throw new Error('User already registered');
    }

    const encryptedPassword = await hashPassword(password);
    const userId = uuidv4();
    const user = { userId, email, password: encryptedPassword };

    await redisClient.set(userKey, JSON.stringify(user));
    return userId;
  };
}
