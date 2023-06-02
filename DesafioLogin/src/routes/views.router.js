import { Router } from "express";

const router = Router();

const auth = (req, res, next) => {
  if(req.session.user) return next()
  return res.send('Error de authentication')
}

router.get("/chat", (req, res) => {
  res.render("socket");
});

router.get('/api/products/',auth , (req, res) => {
  res.render('products');
})

router.get("/agregar", (req, res) => {
  res.render("realTimeProducts");
});

router.get("/home", (req, res) => {
  res.render("home");
});

router.get("/datosUsuario", (req, res) => {
  res.render("usuario");
});



export default router;
