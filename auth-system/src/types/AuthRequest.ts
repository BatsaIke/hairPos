import { Request } from 'express';

// Minimal user payload interface for JWT decoding
export interface UserPayload {
  id: string;
}

// Extended request interface with custom property
export interface AuthRequest extends Request {
  authUser?: UserPayload; // Custom property for authenticated user
}
