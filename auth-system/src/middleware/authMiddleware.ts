import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User, { IUser } from '../models/User'; // Import User model

dotenv.config();

// Minimal user payload interface for JWT decoding
interface UserPayload {
  id: string;
}

// Extended request interface with custom property
export interface AuthRequest extends Request {
  authUser?: UserPayload; // Custom property for authenticated user
}

// Middleware to verify JWT token
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Unauthorized - No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
    req.authUser = { id: decoded.id };
    next();
  } catch (error) {
    console.error('Token Verification Error:', error);
    res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};

// Middleware to verify user roles
export const verifyRole = (requiredRole: 'admin' | 'user') => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.authUser) {
      res.status(401).json({ message: 'Unauthorized - No token verified' });
      return;
    }

    User.findById(req.authUser.id)
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: 'User not found' });
          return;
        }

        if (user.role !== requiredRole) {
          res.status(403).json({ message: `Forbidden - Requires ${requiredRole} role` });
          return;
        }

        next(); // User has the required role
      })
      .catch((error) => {
        console.error('Role Verification Error:', error);
        res.status(500).json({ message: 'Server error' });
      });
  };
};
