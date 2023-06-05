import { Router } from "express";
import ProductsManagerMongoose from "../persistencia/productsManagerMoongos.js";

const manager = new ProductsManagerMongoose();
// const products = await manager.getProducts();

const router = Router();

router.get("/chat", (req, res) => {
  res.render("socket");
});

// router.get("/", async (req, res) => {
//   await manager
//     .getProducts()
//     .then((document) => {
//       const context = {
//         usersDocuments: document.map((doc) => {
//           return {
//             title: doc.title,
//             description: doc.description,
//           };
//         }),
//       };
//       res.render("home", {
//         usersDocuments: context.usersDocuments,
//       });
//     })
//     .catch((error) => res.status(500).send(error));
// });

router.get("/agregar", (req, res) => {
  res.render("realTimeProducts");
});

export default router;
