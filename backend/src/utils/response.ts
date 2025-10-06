import { Response } from 'express';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export const successResponse = <T = any>(
  res: Response, 
  data?: T, 
  message: string = 'Opération réussie',
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };

  return res.status(statusCode).json(response);
};

export const errorResponse = (
  res: Response,
  message: string,
  statusCode: number = 500,
  error?: string
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    error: error || message,
    timestamp: new Date().toISOString()
  };

  return res.status(statusCode).json(response);
};