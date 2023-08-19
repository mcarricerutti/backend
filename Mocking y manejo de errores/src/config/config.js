import dotenv from 'dotenv';

dotenv.config()

export default {
    mongo_url: process.env.MONGO_URL,
    port: process.env.PORT,
    signed_cookie: process.env.SIGNED_COOKIE,
    session_secret: process.env.SESSION_SECRET,
    salt: process.env.SALT,
    github_client_id: process.env.GITHUB_CLIENT_ID,
    github_client_secret: process.env.GITHUB_CLIENT_SECRET,
    admin_email: process.env.ADMIN_EMAIL,
    admin_password: process.env.ADMIN_PASSWORD,
    gmail_user: process.env.GMAIL_USER,
    gmail_password: process.env.GMAIL_PASSWORD,
    jwt_secret: process.env.JWT_SECRET,
    jwt_cookie: process.env.JWT_COOKIE
}