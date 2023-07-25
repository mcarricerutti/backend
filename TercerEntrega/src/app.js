import {Server} from 'socket.io';
import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import './persistencia/mongoDB/configMongo.js';
import MongoStore from 'connect-mongo'; //Sessiones en Mongo
import productRouter from './routes/product.routes.js';
import cartRouter from './routes/cart.routes.js';
import chatRouter from './routes/chat.routes.js';
import homeRouter from './routes/home.routes.js';
import sessionRouter from './routes/sessions.routes.js';
import userRouter from './routes/user.routes.js';
import { __dirname } from './utils/path.js';
import { engine } from 'express-handlebars';
import * as path from 'path';
import { error } from 'console';
import errorHandler from './middlewares/errors.js';


export const app = express();
const port = process.env.PORT;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, "./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    store: MongoStore.create({
      mongoUrl: process.env.URL_MONGODB_ATLAS,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 300,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false, 
    saveUninitialized: false
}))
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//Escuchar Servidor
const httpserver=app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

//ServerIO (WebSockets)
const io= new Server(httpserver,{cors:{origin:'*'}});
app.use((req, res, next) => {
    req.io = io;
    return next();
  });


//Routes
app.use('/api/products', express.static(__dirname +'/public'))
app.use('/api/carts', express.static(__dirname +'/public'))
app.use('/chat', express.static(__dirname +'/public'))
app.use('/', express.static(__dirname +'/public'))

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/users', userRouter);
app.use('/chat', chatRouter);
app.use('/api/sessions', sessionRouter);
app.use('/', homeRouter);

app.use(errorHandler);

