const express = require("express");
const passport = require("passport");
const { User } = require("../models");
const router = express.Router();
const categoriesRouter = require("./categories");
const usersRouter = require("./users");
const productsRouter = require("./products");
const ordersRouter = require("./orders");
const cartRouter = require("./cart");

router.use("/categories", categoriesRouter);
router.use("/users", usersRouter);
router.use("/products", productsRouter);
router.use("/orders", ordersRouter);
router.use("/cart", cartRouter);

router.post("/register", (req, res) => {
  User.create(req.body)
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => console.log(err));
});

router.get("/404", (req, res) => {
  res.send("No existe el usuario");
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.send(req.user);
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/me", (req, res) => {
  console.log("authenticate", req.isAuthenticated());
  console.log("/ME", req.user);
  if (!req.user) return res.sendStatus(401);
  res.send(req.user);
});

router.get("/test", (req, res) => {
  console.log(req.user);
});

router.use("/", function (req, res) {
  res.sendStatus(404);
});

module.exports = router;
