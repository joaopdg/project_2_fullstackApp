const isLoggedIn = require("../middleware/isLoggedIn");
const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Comment = require("../models/Comment.model");

const router = require("express").Router();

router.get("/profile", isLoggedIn, (req, res, next) => {
  res.render("user/profile");
});

/* router.get("/profile/:id", isLoggedIn, (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => res.render("user/profile", { user }))
    .catch((err) => next(err));
});
 */
router.get("/list", isLoggedIn, (req, res, next) => {
  Post.find()
    .then((posts) => res.render("ads/list", { posts }))
    .catch((err) => next(err));
});

router.get("/profile/edit", isLoggedIn, (req, res, next) => {
  res.render("user/edit-profile", { user: req.session.user });
});

router.post("/profile/edit", isLoggedIn, (req, res, next) => {
  const { name, email, password, location, address, contact } = req.body;
  User.findOneAndUpdate(email, {
    name,
    email,
    password,
    location,
    address,
    contact,
  })
    .then(() => {
      res.redirect("/profile");
    })
    .catch((err) => next(err));
});

module.exports = router;
