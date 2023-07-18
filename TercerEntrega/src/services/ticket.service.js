import { ticketsMongo } from "../persistencia/DAOs/mongoDao/ticketsMongo.js";

class TicketService {
    async findAll() {
        try {
            return await ticketsMongo.findAll();
        } catch (error) {
            return error;
        }
    }
    async findById(id) {
        try {
            return await ticketsMongo.findById(id);
        } catch (error) {
            return error;
        }
    }
    async findByIdAndPopulate(id, populateStr) {
        try {
            return await ticketsMongo.findByIdAndPopulate(id, populateStr);
        } catch (error) {
            return error;
        }
    }
    async findOneAndUpdate(filter, update, options) {
        try {
            return await ticketsMongo.findOneAndUpdate(filter, update, options);
        } catch (error) {
            return error;
        }
    }
    async create(data) {
        try {
            return await ticketsMongo.create(data);
        } catch (error) {
            return error;
        }
    }
    async delete(id) {
        try {
            return await ticketsMongo.delete(id);
        } catch (error) {
            return error;
        }
    }
}

const ticketService = new TicketService();
export default ticketService;