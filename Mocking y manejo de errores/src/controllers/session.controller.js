import {getUserDTO} from '../persistencia/DTOs/user.js'


export const destroySession = (req,res,next) => {
    if(req.session) {
        req.session.destroy(() => res.redirect('/'))
    }
}

export const current = (req,res) => {
  let user = getUserDTO(req.user)
  return res.status(200).json({message: 'User active', user})
}