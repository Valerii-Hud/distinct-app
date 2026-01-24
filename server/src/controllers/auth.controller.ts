import { Request, Response } from 'express';

export const signup = (req: Request, res: Response) => {
  res.status(200).json({ success: true });
};

export const login = (req: Request, res: Response) => {
  res.status(200).json({ success: true });
};

export const logout = (req: Request, res: Response) => {
  res.status(200).json({ success: true });
};
