const isLoggedIn = require("../middleware/isLoggedIn");
const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Comment = require("../models/Comment.model");

const router = require("express").Router();


  router.get("/profile/:id", isLoggedIn, (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => res.render("user/profile", { user }))
    .catch((err) => next(err));
});
 


router.get("/profile/:id/edit", isLoggedIn, (req, res, next) => {
  const { id } = req.params;
  User.findById(id).then((user) => {
    res.render("user/edit-profile",  {user} );
  });
});

router.post("/profile/:id/edit", isLoggedIn, (req, res, next) => {
  const { id } = req.params;
  const { name, email, password, location, address, contact } = req.body;
  User.findByIdAndUpdate(id, {
    name,
    email,
    password,
    location,
    address,
    contact,
  })
    .then(() => {
      res.render("user/profile", { user: req.session.user });
    })
    .catch((err) => next(err));
});

module.exports = router;
