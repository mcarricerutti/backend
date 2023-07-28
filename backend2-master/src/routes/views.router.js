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

router.get("/profile", (req,res) => {
  res.render("profile");
})

router.get("/home", (req,res) => {
  res.render("home")
})

router.get("/carrito", (req,res) => {
  res.render("carts")
})



router.get('/signup',(req,res)=>{
  res.render('signup')
})

router.get('/errorSignup',(req,res)=>{
  res.render('errorSignup')
})

router.get('/login',(req,res)=>{
  res.render('login')
})

router.get('/profile',(req,res)=>{
  res.render('profile',{email: req.session.email})
})

router.get('/errorLogin',(req,res)=>{
  res.render('errorLogin')
})


export default router;
