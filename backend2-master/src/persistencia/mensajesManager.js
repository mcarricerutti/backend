import {messagesModel} from './models/message.model.js'
export default class MensajeManagerMongoose{
    async getMensajes(){
        try {
            const mensajes = await messagesModel.find({})
            return mensajes
        } catch (error) {
            console.log(error)
        }
    }

    async getMensageById(id){
        try {
            const mensaje = await messagesModel.findById(id)
            return mensaje
        } catch (error) {
            console.log(error)
        }
    }

    async createMensaje(mens){
        try {
            const newMensaje = messagesModel.create(mens)
            return newMensaje
        } catch (error) {
            console.log(error)
        }
    }
}