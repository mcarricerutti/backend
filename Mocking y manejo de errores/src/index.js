import config from './config/config.js';
import express from 'express'
import { engine } from 'express-handlebars'
import * as path from 'path'
import { __dirname, __filename } from './utils/path.js';
import './config/dbconfig.js'
import productRouter from './routes/product.routes.js'
import cartRouter from './routes/cart.routes.js'
import userRouter from "./routes/user.routes.js"
import chatRouter from './routes/chat.routes.js'
import sessionsRouter from './routes/sessions.routes.js'
import mailRouter from './routes/mail.routes.js'
import viewsRouter from './routes/views.routes.js'
import { Server } from 'socket.io'
import MessageManager from "./controllers/MessageManager.js";
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStorage from 'connect-mongo' 
import passport from 'passport'
import initializePassport from './config/passport.js'
import errorHandler from "./middlewares/errors.js";
import CustomError from "./services/errors/CustomError.js";
import EErrors from "./services/errors/enumError.js";
import compression from 'express-compression';
import { addLogguer } from './utils/logger.js';


const app = express()
const PORT = config.port || 8080

const httpServer = app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.resolve(__dirname, './public')))
app.use(cookieParser(config.signed_cookie))
app.use(session({
    store: MongoStorage.create({
        mongoUrl: config.mongo_url,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 210
    }),
    secret: config.session_secret,
    resave: true,
    saveUninitialized: true
}))


initializePassport()
app.use(passport.initialize())
app.use(passport.session())
app.use(compression({brotli:{enabled: true, zlib: {}},}));//Comprimir response con Brotli
app.use(addLogguer);//Agrego logger a request


app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))

app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/chat', chatRouter)
app.use('/api/user', userRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/', viewsRouter)
app.use('/api/mail', mailRouter)

app.get('*', (req,res,next) => {
    const error = CustomError.createError({
      name: "Invalid Route",
      cause: "The route is not a valid route",
      message: "The route is not defined",
      code: EErrors.ROUTING_ERROR
    })
    next(error)
});

app.use('/loggerTest', (req, res) => {

    req.logger.debug("Debug");
    req.logger.http("Http");
    req.logger.info("Info");
    req.logger.warning("Warning");
    req.logger.error("Error");
    req.logger.fatal("Fatal");
    res.send("Logger test");
  });//Ruta para evitar error 404 en rutas inexistentes
  
// Manejo de errores
app.use(errorHandler);

const io = new Server(httpServer, { cors: { origin: '*'}})
const msg = new MessageManager()

let clients = []
io.on('connection', socket => {
    console.log('Nuevo cliente conectado')
    
    socket.on('authOk', async (data) => {
        let messages = await msg.getMessages()
        io.emit('messageLogs', messages)

        let text = `${data.user} se ha conectado`
        socket.broadcast.emit('newConnection', text)

        clients.unshift(data)
    
        if(clients.length > 9) {
            let listado = clients.slice(0,9)
            io.emit('onlineConnections', listado)
        } else {
            io.emit('onlineConnections', clients)
        }

    })
    socket.on('message', async (data) => {
        try {
            await msg.createMsg(data.user, data.message)
            let messages = await msg.getMessages()
            io.emit('messageLogs', messages)
        } catch (error) {
            console.log(error);
        }
    })

})
