const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Comment = require("../models/Comment.model");
const fileUpload = require("../config/cloudinary.config");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

router.get("/profile/:id", isLoggedIn, (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      Post.find({ author: id }).then((ads) => {
        res.render("user/profile", { user, ads });
      });
    })

    .catch((err) => next(err));
});

router.get("/profile/:id/edit", isLoggedIn, (req, res, next) => {
  const { id } = req.params;
  if(req.session.user._id === id){
  User.findById(id)
    .then((user) => {
      res.render("user/edit-profile", { user });
    })
    .catch((err) => next(err));
  }else{
    res.redirect('/auth')
  }
});

router.post(
  "/profile/:id/edit",
  isLoggedIn,
  fileUpload.single("user-image"),
  (req, res, next) => {
    const { id } = req.params;



    if(req.session.user._id === id){
    const { name, email, password, location, address, contact } = req.body;

    if (!password) {
      return res.status(400).render("user/edit-profile", {
        errorMessage: "Please provide a new password",
      });
    }

    return bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
    if (req.file) {
      User.findByIdAndUpdate(id, {
        name,
        email,
        password: hashedPassword,
        location,
        address,
        contact,
        imageURL: req.file.path,
      })
        .then(() => {
          res.redirect(`/profile/${id}`);
        })
        .catch((err) => next(err));
    } else {
      User.findByIdAndUpdate(id, {
        name,
        email,
        password: hashedPassword,
        location,
        address,
        contact,
      })
        .then(() => {
          res.redirect(`/profile/${id}`);
        })
        .catch((err) => next(err));
    }})


  }else{
    res.redirect('/auth')
  }
  }
);

router.post("/profile/:id/delete", isLoggedIn, (req, res, next) => {
  const { id } = req.params;
  if(req.session.user._id === id){

  User.findByIdAndRemove(id)
    .then((user) => {
      console.log(user);
      return Post.deleteMany({_id: {$in: user.posts}});
    })
    .then(()=>{
      return Comment.deleteMany({author: id})
    })
    .then(() => {
      
      req.session.destroy();
      res.redirect("/");
    })
    .catch((err) => console.log(err));
  }else{
    res.redirect('/auth')
  }
});


module.exports = router;
