import {request, AdminCookie} from "../setup.test.js"
import {expect} from "chai"

describe("Test Routes Products", async function (){

    before(async function () {
        const mockUser = {
            email:"adminCoder@coder.com",
            password: "adminCoder123"
        }
        const response = await request.post('/api/sessions/trylogin').send(mockUser);
        //console.log(response);
   });

    it('GET /api/products/  All products', async function () {
        const response = await request.get('/api/products/').set('Cookie', `${AdminCookie.name}=${AdminCookie.value}`);
        expect(response).to.be.ok;
        expect(response.statusCode).to.be.eql(200);
    });

    it('GET /api/products/mockingproducts/  Mock products', async function () {
        const response = await request.get('/api/products/mockingproducts');
        expect(response).to.be.ok;
        expect(response.statusCode).to.be.eql(200);
    });

    it('GET /api/products/realtimeproducts/  RealTime products', async function () {
        const response = await request.get('/api/products/realtimeproducts');//pasamos la cookie con la autenticacion;
        //console.log(response);
        expect(response).to.be.ok;
        expect(response.statusCode).to.be.eql(200);
    });


});


