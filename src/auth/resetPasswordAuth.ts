import { Request, Response, NextFunction } from "express";

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const forgotPasswordKey = process.env.FORGOT_PASSWORD_SECRET as string;
if (!forgotPasswordKey) {
    throw new Error(
      "Missing required environment variable for reset password"
    );
  }

export function generateForgotPasswordToken(payload: string | object | Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, forgotPasswordKey, { expiresIn: "15m" }, (error: any, token?: string) => {
        if (error) {
          reject(error);
        } else if (token) {
          resolve(token);
        } else {
          reject(new Error('Token is undefined'));
        }
      });
    });
};
  
export async function verifyForgotPasswordToken (token: string): Promise<string> {
  try {
    const decodedToken: any = jwt.verify(token, forgotPasswordKey);
    return decodedToken.email;
  } catch (error: any) {
    throw new Error(`Invalid or expired reset password token: ${error.message}`)
  }
}