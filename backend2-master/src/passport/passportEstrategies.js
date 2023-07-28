import passport from "passport";
import UserModel from "../persistencia/models/user.model.js"
import { Strategy as LocalStrategy } from "passport-local";
import {compareData, hashData} from "../utils/utils.js"
import { Strategy as GithubStrategy } from "passport-github2";

passport.use(
    'login',
    new LocalStrategy(
        {
            usernameField: 'email',
            passReqToCallback: true,
        },
        async (req, email, password, done) => {
            try {
                const user = await UserModel.findOne({ email })
                if(!user) {
                    return done(null, false)
                }
                const isPasswordValid = await compareData(password, user.password)
                if(!isPasswordValid){
                    return done(null, false)
                }
                done(null, user)
            }
            catch(error) {
                done(error)
            }
        }
))

passport.use(
    'signup',
    new LocalStrategy(
      {
        usernameField: 'email',
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        const userDB = await UserModel.findOne({ email })
        if (userDB) {
          return done(null, userDB)
        }
        const hashPassword = await hashData(password)
        const newUser = { ...req.body, password: hashPassword }
        const newUserDB = await UserModel.create(newUser)
        done(null, newUserDB)
      }
    )
  )

//github - passport 
passport.use(
    'githubSignup',
     new GithubStrategy(
        {
        clientID:'Iv1.1ec9f5b89285608a',
        clientSecret:'829c8eb61b358f963ea0ed65fbc30fb39ef29b0c',
        callbackURL:'http://localhost:8080/users/github',
    },
    async(accessToken, refreshToken, profile, done) => {
        const { name, email } = profile._json
        try{
            const userDB = await UserModel.findOne({email})
            if(userDB){
                return done(null, userDB)
            }
            const user = {
                first_name : name.split(' ')[0],
                last_name: name.split(' ')[1] || '',
                email,
                password: 'github',
            }
            const newUserDB = await UserModel.create(user)
            done(null, newUserDB)
        }catch (error){
            done(error)
        }
    }))

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    try{
        const user = await UserModel.findById(id)
        done(null, user)
    } catch (error){
        done(error)
    }
})

