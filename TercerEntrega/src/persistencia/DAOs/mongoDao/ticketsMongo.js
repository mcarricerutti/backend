import ticketModel from '../../mongoDB/models/tickets.model.js'
import BasicMongo from './basicMongo.js'

class TicketMongo extends BasicMongo {
    constructor(model) {
        super(model);
    }
}
export const ticketsMongo = new TicketMongo(ticketModel);