const router = require("express").Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const mongoose = require("mongoose");
const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Comment = require("../models/Comment.model");

router.get("/list", isLoggedIn, (req, res, next) => {
  Post.find({})
    .then((posts) => res.render("ads/list", { posts, user: req.session.user }))
    .catch((err) => next(err));
});

//create-ad

router.get("/create-ad/:id", isLoggedIn, (req, res, next) => {
  const { id } = req.params;
  User.findById(id).then((user) => {
    res.render("ads/ad-create", { user });
    console.log(user);
  });
});

router.post(
  "/create-ad/:id",
  isLoggedIn,
  fileUpload.single("ad-image"),
  (req, res, next) => {
    const { id } = req.params;
    const { user, comments, title, category, description, condition } =
      req.body;

    Post.create({
      user,
      comments,
      title,
      category,
      description,
      condition,
      imageUrl: req.file.path,
    })
      .then((newAd) => {
        res.render("user/profile", { newAd, user: req.session.user });
      })
      .catch((err) => next(err));
  }
);

module.exports = router;
