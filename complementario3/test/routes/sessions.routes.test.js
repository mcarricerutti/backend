import {request} from "../setup.test.js"
import {expect} from "chai"
import userModel from "../../src/persistencia/mongoDB/models/users.model.js";

describe("Test Routes Sessions", async function (){

    it('POST /api/sessions/tryregister  Register Successfull', async function () {
        const mockUser = {
            first_name: "TestName",
            last_name: "TestLastName",
            email: "namelastname@test.cl",
            age: 20,
            password: "123456"
        }
        const response = await request.post('/api/sessions/tryregister').send(mockUser);
        expect(response).to.be.ok;
        expect(response.statusCode).to.be.eql(200);
        await userModel.deleteOne({email: "namelastname@test.cl"})
    });

    it('POST /api/sessions/tryregister  Email already exists', async function () {
        const mockUser = {
            first_name: "TestName",
            last_name: "TestLastName",
            email: "martinacarri345@gmail.com",
            age: 20,
            password: "123456"
        }
        const response = await request.post('/api/sessions/tryregister').send(mockUser);
        expect(response).to.be.ok;
        expect(response.statusCode).to.be.eql(302);
    });

    it('POST /api/sessions/trylogin Login Success', async function () {
        const mockUser = {
            email:"adminCoder@coder.com",
            password: "adminCoder123"
        }
        const response = await request.post('/api/sessions/trylogin').send(mockUser);
        expect(response).to.be.ok;
        expect(response.statusCode).to.be.eql(303); //303 porque redirecciona a /api/products
    });

    it('POST /api/sessions/trylogin Login Wrong Password', async function () {
        const mockUser = {
            email:"adminCoder@coder.com",
            password: "blablabla"
        }
        const response = await request.post('/api/sessions/trylogin').send(mockUser);
        expect(response).to.be.ok;
        expect(response.headers.location).to.be.eql('faillogin');
    });

    it('POST /api/sessions/trylogin Login Wrong email', async function () {
        const mockUser = {
            email:"z@z.cl",
            password: "blablabla"
        }
        const response = await request.post('/api/sessions/trylogin').send(mockUser);
        expect(response).to.be.ok;
        expect(response.headers.location).to.be.eql('faillogin');
    });

})




