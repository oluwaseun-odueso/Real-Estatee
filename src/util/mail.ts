import nodemailer from 'nodemailer';
import {generateForgotPasswordToken} from '../auth/resetPasswordAuth'
import dotenv from 'dotenv';
dotenv.config();

const sender = process.env.SERVICE_EMAIL

export async function mail(recipient: string) {
    const token = await generateForgotPasswordToken({email: "seunoduez@gmail.com"})

    const transporter = nodemailer.createTransport({
        service : "gmail",
        auth: {
            user: "",
            pass: process.env.EMAIL_PASSWORD
        }  
    });

    const options = {
        from: sender,
        to: recipient,
        subject: "Sending email with node.js!",
        text: "Wow! That's simple! " + token
    };

    console.log(options)

    transporter.sendMail(options, function(err, info) {
        if(err) {
            console.log(err);
            return;
        }
        console.log("Email sent: " + info.response);
    })
}

function mail2(recipient: string) {
    generateForgotPasswordToken({email: "seunoduez@gmail.com"})
        .then((token: string) => {
            const transporter = nodemailer.createTransport({
                service : "gmail",
                auth: {
                    user: "",
                    pass: process.env.EMAIL_PASSWORD
                }  
            });
        
            const options = {
                from: sender,
                to: recipient,
                subject: "Sending email with node.js!",
                text: "Wow! That's simple! " + token
            };
        
            console.log(options)

            transporter.sendMail(options, function(err, info) {
                if(err) {
                    console.log(err);
                    return;
                }
                console.log("Email sent: " + info.response);
            })
        })
}

mail("seunoduez@gmail.com")