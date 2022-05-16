const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Comment = require("../models/Comment.model");


//create-ad

router.get("/create-ad", isLoggedIn, (req, res, next) => {
    res.render("ads/ad-create", { user: req.session.user });
  });

  router.post("/create-ad", isLoggedIn, (req, res, next) => {
    const {user, comments,title,category, description,condition}=req.body

    res.render("ads/ad-create", { user: req.session.user });
  });





  module.exports = router;