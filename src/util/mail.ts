import nodemailer from "nodemailer";
import { generateForgotPasswordToken } from "../auth/resetPasswordAuth";
import dotenv from "dotenv";
dotenv.config();

const sender = process.env.SERVICE_EMAIL;

export async function mail(recipient: string) {
  const token = await generateForgotPasswordToken({
    email: recipient,
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: sender,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const options = {
    from: sender,
    to: recipient,
    subject: "Reset password - Real Estatery",
    text: "Reset your password with the token below: " + token,
  };

  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
      return;
    }
  });
}

