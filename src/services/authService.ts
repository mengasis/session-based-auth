import redisClient from '../config/redisClient';
import { v4 as uuidv4 } from 'uuid';
import { comparePassword, hashPassword } from '../utils/hashHelper';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '../utils/exceptions';
import {
  isValidEmail,
  isValidPassword,
  validateEmail,
  validatePassword,
} from '../utils/validate';

interface User {
  id: string;
  email: string;
  password: string;
}

export class AuthService {
  private userKeyPrefix = 'user_';
  private emailKeyPrefix = 'email_';
  private sessionKeyPrefix = 'session_';

  registerUser = async (email: string, password: string) => {
    if (!isValidEmail(email)) {
      throw new BadRequestException('Invalid email');
    }

    if (!isValidPassword(password)) {
      throw new BadRequestException('Invalid password');
    }

    const emailKey = `${this.emailKeyPrefix}${email}`;
    const isUserRegistered = await redisClient.get(emailKey);

    if (isUserRegistered) {
      throw new ConflictException('User already registered');
    }

    const encryptedPassword = await hashPassword(password);
    const userId = uuidv4();
    const user: User = { id: userId, email, password: encryptedPassword };

    const userKey = `${this.userKeyPrefix}${user.id}`;
    await redisClient.set(userKey, JSON.stringify(user));
    await redisClient.set(emailKey, userId); // index email -> userId
    return userId;
  };

  validateAndCreateSession = async (email: string, password: string) => {
    if (!isValidEmail(email)) {
      throw new BadRequestException('Invalid email');
    }

    if (!isValidPassword(password)) {
      throw new BadRequestException('Invalid password');
    }

    const emailKey = `${this.emailKeyPrefix}${email}`;
    const userId = await redisClient.get(emailKey);

    if (!userId) {
      /**
       * NOTE: Returning "User not found" here for demonstration purposes only.
       * In a real-world application, use a generic "Invalid credentials"
       * response to avoid exposing user existence,
       * which can lead to enumeration attacks and security risks.
       */
      throw new NotFoundException('User not found');
    }

    const userKey = `${this.userKeyPrefix}${userId}`;
    const userData = await redisClient.get(userKey);

    if (!userData) {
      throw new NotFoundException('User data not found');
    }

    const user: User = JSON.parse(userData);
    const isPasswordValid = await comparePassword(user.password, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const sessionId = uuidv4();
    const sessionKey = `${this.sessionKeyPrefix}${sessionId}`;

    await redisClient.set(sessionKey, user.id, { EX: 3600 });
    return sessionId;
  };

  getUserProfile = async (sessionId: string) => {
    const sessionKey = `${this.sessionKeyPrefix}${sessionId}`;
    const userId = await redisClient.get(sessionKey);

    if (!userId) {
      throw new UnauthorizedException('Invalid session ID');
    }

    const userKey = `${this.userKeyPrefix}${userId}`;
    const user = await redisClient.get(userKey);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return JSON.parse(user);
  };

  invalidateSessions = async (sessionId: string) => {
    const sessionKey = `${this.sessionKeyPrefix}${sessionId}`;
    const result = await redisClient.del(sessionKey);

    if (result === 0) {
      throw new UnauthorizedException('Invalid session ID');
    }
  };
}
