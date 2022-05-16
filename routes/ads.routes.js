const router = require("express").Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const mongoose = require("mongoose");
const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Comment = require("../models/Comment.model");
const fileUpload = require("../config/cloudinary.config");

router.get("/list", isLoggedIn, (req, res, next) => {
  Post.find({})
    .then((posts) => res.render("ads/list", { posts, user: req.session.user }))
    .catch((err) => next(err));
});

//create-ad

router.get("/create-ad/:id", isLoggedIn, (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      res.render("ads/ad-create", { user });
    })
    .catch((err) => next(err));
});

router.post(
  "/create-ad/:id",
  isLoggedIn,
  fileUpload.single("ad-image"),
  (req, res, next) => {
    const { id } = req.params;
    const { title, category, description, condition } = req.body;
    if (req.file) {
      Post.create({
        title,
        category,
        description,
        condition,
        imageURL: req.file.path,
        author: id,
      })
        .then((newAd) => {
          return User.findByIdAndUpdate(id, { $push: { posts: newAd._id } });
        })
        .then(() => {
          res.redirect(`/profile/${id}`);
        })
        .catch((err) => next(err));
    } else {
      Post.create({
        title,
        category,
        description,
        condition,
        author: id,
      })
        .then((newAd) => {
          return User.findByIdAndUpdate(id, { $push: { posts: newAd._id } });
        })
        .then(() => {
          res.redirect(`/profile/${id}`);
        })
        .catch((err) => next(err));
    }
  }
);

module.exports = router;
