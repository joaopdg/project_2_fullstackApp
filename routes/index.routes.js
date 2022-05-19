const router = require("express").Router();
const User = require("../models/User.model");

/* GET home page */
router.get("/", (req, res, next) => {
if (!req.session.user){
  res.render("index");
}else{
  User.findById(req.session.user._id)
  .populate('receivedReq')
  .populate({
    path: "receivedReq",
    populate: {
      path: "sender", 
      model: "User",
    },
  })
  .populate({
    path: "receivedReq",
    populate: {
      path: "senderItem", 
      model: "Post",
    },
  })
  .populate({
    path: "receivedReq",
    populate: {
      path: "receiverItem", 
      model: "Post",
    },
  })
  .then((newUser) => {
    req.app.locals.currentUser = newUser;
    res.render("index", {user:req.session.user});

  })}

});


module.exports = router;
