import type { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { UnauthorizedException } from '../utils/exceptions';

export class AuthController {
  private authService = new AuthService();

  register = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
      const userId = await this.authService.registerUser(email, password);
      res.status(201).json({ message: 'User registered', userId });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const sessionId = await this.authService.validateAndCreateSession(
        email,
        password,
      );

      res.cookie('sessionId', sessionId, { httpOnly: true, secure: true});
      res.status(200).json({ message: 'Login Successful' });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionId = req.cookies.sessionId;

      if (!sessionId) {
        throw new UnauthorizedException('No session cookie provided');
      }

      await this.authService.invalidateSessions(sessionId);
      res.clearCookie('sessionId');
      res.status(200).json({ message: 'Logout Successful' });
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('GET Profile', req.cookies)
      const sessionId = req.cookies.sessionId;

      if (!sessionId) {
        throw new UnauthorizedException('No session cookie provided');
      }

      const userData = await this.authService.getUserProfile(sessionId);
      res.status(200).json(userData);
    } catch (error) {
      next(error);
    }
  };
}
