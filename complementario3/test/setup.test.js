import mongoose from "mongoose";
import 'dotenv/config';
import { options } from "../src/utils/commander.js"
import supertest from "supertest"
import {app} from "../src/app.js";

const enviroment = options.mode
const domain = enviroment === 'production' ? 'http://localhost:${process.env.PORT}' : `http://localhost:8080`;
export const request = supertest(domain);

export let AdminCookie=null;
before(async()=>{
    await mongoose.connect(process.env.URL_MONGODB_ATLAS);

    const mockUser = {
        email:"adminCoder@coder.com",
        password: "adminCoder123"
    }
    const response = await request.post('/api/sessions/trylogin').send(mockUser);
    const cookieHeader = response.headers['set-cookie'][0];
    AdminCookie = {
        name: cookieHeader.split('=')[0],
        value: cookieHeader.split('=')[1],
    }
})

after(async()=>{
    await mongoose.connection.close();
});