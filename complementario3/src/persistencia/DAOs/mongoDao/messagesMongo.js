import messagesModel from '../../mongoDB/models/messages.model.js'
import BasicMongo from './basicMongo.js'

class MessagesMongo extends BasicMongo {
    constructor(model) {
        super(model);
    }
}
export const messageMongo = new MessagesMongo(messagesModel);