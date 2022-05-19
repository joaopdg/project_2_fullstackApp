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

router.post("/ad-details/:id/request", isLoggedIn, async (req, res, next) => {
  const { id } = req.params;
  const { sender, receiver, message, senderItem, receiverItem } = req.body;

  let request = await Request.create({
    sender,
    receiver,
    message,
    senderItem,
    receiverItem: id,
  });

  await User.findByIdAndUpdate(
    request.receiver,
    { $push: { receivedReq: request._id } },
    { new: true }
  );

  await User.findByIdAndUpdate(
    request.sender,
    { $push: { sentReq: request._id } },
    { new: true }
  );

  res.redirect(`/ad-details/${id}`);
});

router.get("/request/:id/accept", isLoggedIn, async (req, res, next) => {
  const { id } = req.params;
  let request = await Request.findByIdAndUpdate(
    id,
    { status: true },
    { new: true }
  )

    .populate({
      path: "sender",
      model: "User",
    })
    .populate({
      path: "senderItem",
      model: "Post",
    })
    .populate({
      path: "receiverItem",
      model: "Post",
    })
    .populate({
      path: "receiver",
      model: "User",
    });
  await User.findByIdAndUpdate(request.receiver._id, {
    $pull: { receivedReq: request._id },
  });

  res.render("ads/req-response", request);
});

router.get("/request/:id/reject", isLoggedIn, async (req, res, next) => {
  const { id } = req.params;
  let request = await Request.findByIdAndUpdate(
    id,
    { new: true }
  );

  await User.findByIdAndUpdate(request.receiver, {
    $pull: { receivedReq: request._id },
  });

  res.redirect('/');
});

module.exports = router;
