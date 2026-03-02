import { Request, Response } from 'express';
import { authService, RegisterInput, LoginInput, AuthResponse } from './auth.service';
import { success, ok } from '@utils/response';
import { CACHE_KEYS, redis } from '@utils/redis';

export class AuthController {
  public register = async (req: Request, res: Response) => {
    const input = req.body as RegisterInput;
    const tokens = await authService.register(input);
    res.status(201).json(success(tokens, 'Registration successful'));
  };

  public login = async (req: Request, res: Response) => {
    const input = req.body as LoginInput;
    const tokens = await authService.login(input);
    res.json(success(tokens, 'Login successful'));
  };

  public logout = async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken as string;
    if (refreshToken && req.userId) {
      await authService.logout(req.userId, refreshToken);
    }
    
    // Add current access token to blacklist
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      await redis.set(CACHE_KEYS.BLACKLIST(token), 'true', 15 * 60); // 15 mins
    }
    
    res.json(ok('Logged out successfully'));
  };

  public refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshToken(refreshToken);
    res.json(success(tokens, 'Token refreshed'));
  };

  public verifyEmail = async (req: Request, res: Response) => {
    // Scaffold implementation
    res.json(ok('Email verified'));
  };

  public requestPasswordReset = async (req: Request, res: Response) => {
    const { email } = req.body;
    await authService.initiatePasswordReset(email);
    res.json(ok('Password reset link sent to your email'));
  };

  public resetPassword = async (req: Request, res: Response) => {
    const { token, password } = req.body;
    await authService.resetPassword(token, password);
    res.json(ok('Password has been reset successfully'));
  };

  public changePassword = async (req: Request, res: Response) => {
    // Scaffold implementation
    res.json(ok('Password changed successfully'));
  };

  public me = async (req: Request, res: Response) => {
    // Scaffold implementation
    res.json(success({
      id: req.userId,
      email: req.email,
      role: req.role
    }, 'Current user profile'));
  };
}

export const authController = new AuthController();
