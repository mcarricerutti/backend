import passport from 'passport'
import config from './config.js'
import userService from '../services/users.service.js'
import { validatePassword } from '../utils/bcrypt.js'
import { Strategy as LocalStrategy} from 'passport-local'
import { Strategy as GitHubStrategy} from 'passport-github2'

const initializePassport = () => {

    // Register
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const {email} = req.body
            try {
                const user = await userService.findByEmail(email)
                if(user) {
                    return done(null, false) // Usuario ya registrado
                }
                // Llama al servicio que lo crea
                const newUser = await userService.createUser(req.body)
                
                return done(null, newUser)

            } catch (error) {
                return done(error)
            }
        }
    ))

    //Config de sessions
        //Inicializar la session
    passport.serializeUser((user, done) => {
        done(null,user._id)
    })

        // Eliminar la session del user
    passport.deserializeUser(async (id, done) => {
        const user = await userService.findById(id)
        done(null,user)
    })

    // Login
    passport.use('login', new LocalStrategy(
        { usernameField: 'email' }, 
        async (username, password, done) => {
            try {
                const user = await userService.findByEmail(username)

                if(!user) { // No se encuentra el usuario
                    return done(null, false)
                }

                if(!validatePassword(password, user.password)) { 
                    return done(null, false) // Contraseña invalida
                }

                return done(null, user)// Usuario Logueado


            } catch (error) {
                return done(error)
            }
        }
    ))


    // Github
    passport.use('github', new GitHubStrategy({
        clientID: config.github_client_id,
        clientSecret: config.github_client_secret,
        callbackURL: "http://localhost:4000/api/sessions/github/callback"
      },
      async (accessToken, refreshToken, profile, done) => {
        const {name,email} = profile._json
        try {
            const userDB = await userService.findByEmail(email)
    
            if(userDB){
                return done(null,userDB)
            }
    
            const user = {
                first_name: name.split(' ')[0],
                last_name: name.split(' ')[1] || '',
                email,
                password: ' ',
                method: 'github'
            }

            const newUserDB = await userService.createUser(user)
            done(null,newUserDB);
    
        } catch (error) {
            done(error)
        }
    }));
}


export default initializePassport