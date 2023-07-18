import nodemailer from 'nodemailer';
import 'dotenv/config';

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
            from: `"TECLAM" <${email}>`,
            to: to,
            subject: subject,
            text: text,
            html: html,
            attachments: attachments
        });
        console.log("Message sent: %s", info.messageId);
        return true;

    } catch (error) {
        console.log(error);
        return false;
    }
};

export default sendMail;