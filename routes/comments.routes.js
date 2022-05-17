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

      newComment = new Comment({ author: req.session.user._id, post:post._id, content });

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

router.post("/ad-details/:commentid", (req, res, next) => {
  const { commentid } = req.params;
  Comment.findById(commentid)
    .then((comment) => {
      return Post.findById(comment.post._id);
    })
    .then((post) => {
      Comment.findByIdAndRemove(commentid)
      .then(() => console.log("removed"))
      return post;
    })
    .then((post) => {
      res.redirect(`/ad-details/${post._id}`);
    })
    .catch((err) => console.log(err));
});

module.exports = router;
