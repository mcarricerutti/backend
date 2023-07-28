import { Router } from 'express'
import UserModel from "../persistencia/models/user.model.js"
import "../utils/utils.js"
import { compareData, hashData } from '../utils/utils.js'
import passport from 'passport'


const usersRouter = Router()

usersRouter.get('/logout',(req,res)=>{
  req.session.destroy((error)=>{
    if(error){
      console.log(error);
      res.send(error)
    }else {
      res.redirect('/views/login')
    }
  })
})

//Mongo
usersRouter.post('/signup', async(req, res) => {
  const {email,password} = req.body
  const user = await UserModel.findOne({email})
  if (user) {
    return res.redirect('/views/errorSignup')
  } 
  const hashPassword = await hashData(password)
  const newUser = {...req.body,password:hashPassword}
  await UserModel.create(newUser)
  res.redirect('/views/login')
})

//LOGIN CON PASSPORT 
usersRouter.post('/login', passport.authenticate('login', {
  passReqToCallback:true,
  failureRedirect: '/views/errorLogin',
  successRedirect: '/api/products/',
  failureMessage: ''
})
)

//github
usersRouter.get('/githubSignup',
passport.authenticate('githubSignup', { scope: ['user:email']}))

usersRouter.get('/github',
passport.authenticate('githubSignup', { failureRedirect: 'views/login'}),
function(req,res) {
  res.redirect('/api/products/')
}
)

// usersRouter.get('/current',(req,res)=>{
// })

export default usersRouter