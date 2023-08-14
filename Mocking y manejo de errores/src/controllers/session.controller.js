import {getUserDTO} from '../persistencia/DTOs/user.js'
import userService from "../services/users.service.js"
import sendMail from '../utils/nodemailer.js';
import setPasswordModifiable from "../controllers/views.controller.js"


export const destroySession = (req,res,next) => {
    if(req.session) {
        req.session.destroy(() => res.redirect('/'))
    }
}

export const current = (req,res) => {
  let user = getUserDTO(req.user)
  return res.status(200).json({message: 'User active', user})
}

export const resetPasswordView = async (req, res) => {
  res.render('resetpassword')
}

export const resetPasswordEmail = async (req, res) => {
  try {
      const user = await userService.findOne({ email: req.body.email });
      if (!user) {
          return res.status(400).send({ status: "error", message: "Email no registrado" });
      }
      //Se define una duracion fecha actual + 1 hora
      const date = Date.now() + 3600000;
      await userService.setPasswordModifiable(user._id, date);//Link de recuperacion de contraseña valido por 1 hora

      const html=`
      <h1>Recuperar Contraseña</h1>
      <p>Para recuperar su contraseña ingrese al siguiente link</p>
      <a href="http://localhost:4000/api/users/${user._id}/resetpasswordnewpass">Recuperar Contraseña</a>
      `;
      const sentEmail=await sendMail(req.body.email, "Recuperar Contraseña", "Recupere su contraseña de TECLAM", html, null); 

      req.logger.info("Message sent: %s", sentEmail.messageId); 
      return res.status(200).send({ status: "success", message: "Email de recuperacion de contraseña enviado" });      
  } catch (error) {
      req.logger.error("Error en resetPasswordEmail");
      return res.status(500).send({ status: "error", message: "Error enviando email" });
  }
}

