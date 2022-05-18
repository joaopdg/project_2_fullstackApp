const router = require("express").Router();
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const mongoose = require("mongoose");
const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Comment = require("../models/Comment.model");
const Request = require("../models/Request.model");

router.get("/ad-details/:id/request", isLoggedIn, (req, res, next) => {
  const { id } = req.params;
  User.findById(req.session.user._id)
    .populate("posts")
    .then((user) => {
      Post.findById(id).then((post) => {
        res.render("ads/send-request", {
          post,
          user,
        });
      });
    })
    .catch((err) => next(err));
});

router.post(
  "/ad-details/:id/request",
  isLoggedIn,
  (req, res, next) => {
    const { id } = req.params;
    const { sender, receiver, message, senderItem, receiverItem } = req.body;

    Request.create({
      sender,
      receiver,
      message,
      senderItem,
      receiverItem: id,
    })
      .then((newReq) => {
        User.findByIdAndUpdate(
          newReq.receiver,
          { $push: { receivedReq: newReq._id } },
          { new: true }
        );
        User.findByIdAndUpdate(
          newReq.sender,
          { $push: { sentReq: newReq._id } },
          { new: true }
        );
      })
      .then(() => {
        res.redirect(`/ad-details/${id}`);
      })
      .catch((err) => next(err));
  }
);

module.exports = router;
