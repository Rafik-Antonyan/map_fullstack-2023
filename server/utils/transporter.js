import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.MAIL_AUTHENTICATION_HOST,
    port: process.env.MAIL_AUTHENTICATION_PORT,
    secure: true,
    auth: {
        user: process.env.MAIL_AUTHENTICATION_USER,
        pass: process.env.MAIL_AUTHENTICATION_PASSWORD
    }
});