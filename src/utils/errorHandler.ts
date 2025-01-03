import type { Request, Response, NextFunction } from 'express';
import { BaseException } from './exceptions';

export function errorHandler(
  err: unknown,
  _: Request,
  res: Response,
  next: NextFunction,
): void {
  if (err instanceof BaseException) {
    const response: Record<string, unknown> = {
      error: err.message,
    };

    if (typeof err.data === 'object' && err.data !== null) {
      response.data = err.data;
    }

    res.status(err.statusCode).json(response);
  } else {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
