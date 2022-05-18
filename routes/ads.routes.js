const router = require("express").Router();
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const mongoose = require("mongoose");
const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Comment = require("../models/Comment.model");
const fileUpload = require("../config/cloudinary.config");

router.get("/list", isLoggedIn, (req, res, next) => {
  Post.find()
    .then((ads) => res.render("ads/list", { ads, user: req.session.user }))
    .catch((err) => next(err));
});

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

router.get("/ad-details/:id", (req, res, next) => {
  const { id } = req.params;
  Post.findById(id)
    .populate("comments")
    .populate({
      path: "comments",
      populate: {
        path: "author",
        model: "User",
      },
    })
    .then((post) => {
      res.render("ads/ad-details", {
        post: post,
        comments: post.comments,
        user: req.session.user,
      });
    })
    .catch((err) => next(err));
});

router.get("/ad-edit/:id", (req, res, next) => {
  const { id } = req.params;

  if (req.session.user.posts.includes(id)) {
    Post.findById(id)
      .then((post) => {
        res.render("ads/ad-edit", { post, user: req.session.user });
      })
      .catch((err) => next(err));
  } else {
    res.redirect("/auth");
  }
});

router.post(
  "/ad-edit/:id",
  isLoggedIn,
  fileUpload.single("ad-image"),
  (req, res, next) => {
    const { id } = req.params;
    const { title, category, description, condition } = req.body;
    if (req.session.user.posts.includes(id)) {
      if (req.file) {
        Post.findByIdAndUpdate(id, {
          title,
          category,
          description,
          condition,
          imageURL: req.file.path,
        })
          .then((post) => {
            res.redirect(`/ad-details/${id}`);
          })
          .catch((err) => next(err));
      } else {
        Post.findByIdAndUpdate(id, {
          title,
          category,
          description,
          condition,
        })
          .then((post) => {
            res.redirect(`/ad-details/${id}`);
          })
          .catch((err) => next(err));
      }
    } else {
      res.redirect("/auth");
    }
  }
);

router.post("/ad-details/:id/delete", (req, res, next) => {
  const { id } = req.params;
  if (req.session.user.posts.includes(id)) {
    Post.findByIdAndRemove(id)
      .then(() => {
        res.redirect(`/profile/${req.session.user._id}`);
      })
      .catch((err) => next(err));
  } else {
    res.redirect("/auth");
  }
});

module.exports = router;
