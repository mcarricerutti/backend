import nodemailer from 'nodemailer';
import 'dotenv/config';
import { devLogger } from './logger.js';

const email = process.env.GOOGLE_MAILER_EMAIL;
const password = process.env.GOOGLE_MAILER_PASSWORD;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: email,
        pass: password
    }
});

const sendMail = async (to, subject, text, html, attachments) => {
    try {
        const info= await transporter.sendMail({
            from: `"Flykite" <${email}>`,
            to: to,
            subject: subject,
            text: text,
            html: html,
            attachments: attachments
        });
        devLogger.info("Message sent: " + info.messageId);
        return true;

    } catch (error) {
        devLogger.error(error);
        return false;
    }
};

export default sendMail;
