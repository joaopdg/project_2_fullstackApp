const router = require("express").Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const mongoose = require("mongoose");
const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Comment = require("../models/Comment.model");
const fileUpload = require("../config/cloudinary.config");

router.get("/list", isLoggedIn, (req, res, next) => {
  Post.find()
    .then((ads) => res.render("ads/list", {ads}))
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
    console.log("check file:", req.file);
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


router.get("/ad-details/:id", (req, res, next) => {
    const { id } = req.params;
    Post.findById(id)
    .then((post)=>{
        res.render("ads/ad-details", post )
    })
  
  });
  

module.exports = router;
