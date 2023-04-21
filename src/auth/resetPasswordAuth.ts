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
      jwt.sign(payload, forgotPasswordKey, { expiresIn: "15m" }, (error, token) => {
        if (error) {
          reject(error);
        } else resolve(token as string);
      });
    });
};
  
export async function verifyForgotPasswordToken(
req: Request,
res: Response,
next: NextFunction
) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).send({
        error: "You are unauthorized to perform this operation.",
        });
    }

    try {
        const decodedToken: any = jwt.verify(token, forgotPasswordKey);
        // return decodedToken.email;
        next();
    } catch (error: any) {
        return res.status(403).send({
        error: error.message,
        });
    }
}
  
export async function verifyForgotPasswordToken2 (token: string): Promise<string> {
  try {
    const decodedToken: any = jwt.verify(token, forgotPasswordKey);
    console.log(decodedToken)
    return decodedToken.email;
  } catch (error: any) {
    throw new Error(`Error verifying forgot password token: ${error.message}`)
  }
}