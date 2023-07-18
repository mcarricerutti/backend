import 'dotenv/config';
import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import GoogleStrategy from "passport-google-oauth20";
import userModel from "../persistencia/mongoDB/models/users.model.js";
import cartModel from '../persistencia/mongoDB/models/carts.model.js';
import { createHash, validatePassword } from "../utils/bcript.js";

const LocalStrategy = local.Strategy;
const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {
                const user = await userModel.findOne({ email: username });

                if (user) {
                    return done(null, false, { message: "El usuario ya existe" });
                }
                const newUser = new userModel({
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                });
                const createdUser = await userModel.create(newUser);
                const newCart=await cartModel.create({products:[]});
                const updatedUser=await userModel.findOneAndUpdate({_id: createdUser._id},{cart: {id_cart: newCart._id}}, {new: true});  
                return done(null, updatedUser);
            } catch (error) {
                return done("Error al obtener el usuario: " + error);
            }

        }));

    passport.use('login', new LocalStrategy({usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username });
            if (!user) {
                return done(null, false, { message: "El usuario no existe" });
            }
            if (validatePassword(password, user.password)) {//Contraseña correcta
                return done(null, user, { message: "Login exitoso" });
            }
            return done(null, false, { message: "Contraseña incorrecta" });
        } catch (error) {
            return done(error);
        }
    }));

    passport.use('github',new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await userModel.findOne({email:profile._json.email});
            if(!user){ 
                const newUser = new userModel({
                    first_name: profile._json.name.split(' ')[0],
                    last_name: profile._json.name.split(' ')[1]??' ',
                    age: 0,
                    email: profile._json.email,
                    password: 'Github'
                });
                const createdUser = await userModel.create(newUser);
                const newCart=await cartModel.create({products:[]});
                const updatedUser=await userModel.findOneAndUpdate({_id: createdUser._id},{cart: {id_cart: newCart._id}}, {new: true});
                return done(null, updatedUser);
            }
            else{
                return done(null, user);
            }
        } catch (error) {
            return done("Error GithubLogin: "+error);
        }
    }));

    passport.use('google',new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/sessions/googlecallback"
      },
      async (accessToken, refreshToken, profile, cb)=> {
        try {
            const user = await userModel.findOne({email:profile._json.email});
            if(!user){
                const newUser = new userModel({
                    first_name: profile._json.given_name,
                    last_name: profile._json.family_name,
                    age: 0,
                    email: profile._json.email,
                    password: 'Google'
                });
                const createdUser = await userModel.create(newUser);
                const newCart=await cartModel.create({products:[]});
                const updatedUser=await userModel.findOneAndUpdate({_id: createdUser._id},{cart: {id_cart: newCart._id}}, {new: true});
                return cb(null, updatedUser);
            }
            else{
                return cb(null, user);
            }
        } catch (error) {
            return cb("Error GoogleLogin: "+error);
        }
      }
    ));

    //Inicializamos la sesion del usuario
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    //Obtener la sesion del usuario
    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id);
        done(null, user);
    });
};

export default initializePassport;