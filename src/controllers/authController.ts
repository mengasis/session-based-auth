import type { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  private authService = new AuthService();

  register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const userId = await this.authService.registerUser(email, password);
      res.status(201).json({ message: 'User registered', userId });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };
}
