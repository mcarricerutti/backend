import messageModel from '../persistencia/mongoDB/models/messages.model.js';


export const getChat = (req, res) => {
    const io=req.io;
    //Conexion a socket.io
    io.on('connection', async(socket)=>{//cuando se establece la conexion envio un mensaje
        console.log('Cliente conectado a Chat');
        
        socket.on('client:messageSent', async (data)=>{
          await messageModel.create(data);
          const messages= await messageModel.find();
          io.emit('server:messageStored', messages)//envio todos los mensajes a todos los clientes
        });

        socket.on('client:onLoadMessages', async ()=>{
            const messages= await messageModel.find();
            io.emit('server:onLoadMessages', messages)//envio todos los mensajes a todos los clientes
        });
    }) 
    res.render('chat')
};