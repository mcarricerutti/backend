import nodemailer from 'nodemailer'
import config from '../config/config.js'

export const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: config.gmail_user,
        pass: config.gmail_password
    }
})

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
        devLogger.info("Message sent: " + info.messageId);
        return true;

    } catch (error) {
        devLogger.error(error);
        return false;
    }
};

export default sendMail;


