import Messages from "../persistencia/models/Messages.js";

export class MessageManager {

    // Crea un mensaje nuevo
    async createMsg(user, message) {
        try {
            await Messages.create(
                {
                    user,
                    message
                }
            )
        } catch (error) {
            console.log(error);
        }
    }

    // Trae los mensajes guardados
    async getMessages() {
        const msgs = await Messages.find({})
        return msgs
    }

}

export default MessageManager