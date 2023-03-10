import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { BuyerType } from '../functions/buyerFunctions'
require("dotenv").config();

const secretKey = process.env.PAYLOAD_SECRET as string;
if (!secretKey) {
  throw new Error(
    "Missing required environment variable for Buyer Authentication"
  );
}

export function generateBuyerToken(payload: BuyerType): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secretKey, { expiresIn: "15m" }, (error, token) => {
      if (error) {
        reject(error);
      } else resolve(token as string);
    });
  });
};

export async function verifyBuyerToken(
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
    const buyer = jwt.verify(token, secretKey);
    req.buyer = buyer;
    next();
  } catch (error) {
    return res.status(403).send({
      error: "Your session has expired. Please log in again.",
    });
  }
}
