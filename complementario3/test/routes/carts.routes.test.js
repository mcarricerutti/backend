import {request, AdminCookie} from "../setup.test.js"
import {expect} from "chai"



describe("Test Routes Carts", async function (){

    it('GET /api/carts/  Get all carts', async function () {
        const response = await request.get('/api/carts/');
        expect(response).to.be.ok;
        expect(response.statusCode).to.be.eql(200);
    });

    it('GET /api/carts/:id  Get cart by id', async function () {
        const response = await request.get('/api/carts/64bfd64636bfbbb713be4df5');
        expect(response).to.be.ok;
        expect(response.statusCode).to.be.eql(200);
    });

    let newCart = null;
    it('GET /api/carts/createcart  Create cart', async function () {
        const response = await request.get('/api/carts/createcart');
        newCart = response.body;
        expect(response).to.be.ok;
        expect(response.statusCode).to.be.eql(200);
    });

    it('DELETE /api/carts/:id  Delete cart by id', async function () {
        const response = await request.delete(`/api/carts/${newCart._id}`).set('Cookie', `${AdminCookie.name}=${AdminCookie.value}`);
        expect(response).to.be.ok;
        expect(response.statusCode).to.be.eql(200);
    });

});




