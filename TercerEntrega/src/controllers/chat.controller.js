import messageModel from '../persistencia/mongoDB/models/messages.model.js';


export const getChat = (req, res) => {
    const io=req.io;
    io.on('connection', async(socket)=>{
        console.log('Cliente conectado a Chat');
        
        socket.on('client:messageSent', async (data)=>{
          await messageModel.create(data);
          const messages= await messageModel.find();
          io.emit('server:messageStored', messages)
        });

        socket.on('client:onLoadMessages', async ()=>{
            const messages= await messageModel.find();
            io.emit('server:onLoadMessages', messages)
        });
    }) 
    res.render('chat')
};