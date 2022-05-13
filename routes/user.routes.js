const isLoggedIn = require("../middleware/isLoggedIn");
const User = require("../models/User.model");

const router = require("express").Router();

router.get("/profile", isLoggedIn, (req, res, next) => {
  res.render("user/profile");
});

router.get("/profile/:id", isLoggedIn, (req, res, next) => {
    const {id} = req.params
    User.findById(id)
    .then((user) => res.render("user/profile", {user}))
    .catch((err) => next (err))
  });


router.get('/ads-list', isLoggedIn, (req, res, next) => {
    Post.find()
    .then((posts) => res.render('ads-list', {posts}))
    .catch((err) => next (err))
})








module.exports = router;
 