const router = require("express").Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const mongoose = require("mongoose");
const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Comment = require("../models/Comment.model");

router.post("/ad-details/:id/comments", (req, res, next) => {
  const { id } = req.params;
  const { author, content } = req.body;

  Post.findById(id)
    .then((post) => {
      let newComment;

      newComment = new Comment({ author: req.session.user._id, content });

      newComment.save().then((savedComment) => {
        post.comments.push(savedComment._id);

        post
          .save()
          .then((updatedPost) =>
            res.redirect(`/ad-details/${updatedPost._id}`)
          );
      });
    })
    .catch((err) => next(err));
});

module.exports = router;
