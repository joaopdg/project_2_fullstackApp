const router = require("express").Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const fileUpload = require("../config/cloudinary.config");

router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

router.post(
  "/signup",
  isLoggedOut,
  fileUpload.single("user-image"),
  (req, res) => {
    const { name, email, password, address, location, contact } = req.body;

    if (!name) {
      return res.status(400).render("auth/signup", {
        errorMessage: "Please provide your name.",
      });
    }

    if (password.length < 8) {
      return res.status(400).render("auth/signup", {
        errorMessage: "Your password needs to be at least 8 characters long.",
      });
    }

    User.findOne({ name }).then((found) => {
      // If the user is found, send the message name is taken
      if (found) {
        return res
          .status(400)
          .render("auth/signup", { errorMessage: "name already taken." });
      }

      // if user is not found, create a new user - start with hashing the password
      return bcrypt
        .genSalt(saltRounds)
        .then((salt) => bcrypt.hash(password, salt))
        .then((hashedPassword) => {
          // Create a user and save it in the database

          if (req.file) {
            return User.create({
              name,
              email,
              password: hashedPassword,
              address,
              location,
              contact,
              imageURL: req.file.path,
            });
          } else {
            return User.create({
              name,
              email,
              password: hashedPassword,
              address,
              location,
              contact,
            });
          }
        })
        .then((user) => {
          // Bind the user to the session object
          req.session.user = user;
          res.redirect("/");
        })
        .catch((error) => {
          if (error instanceof mongoose.Error.ValidationError) {
            return res
              .status(400)
              .render("auth/signup", { errorMessage: error.message });
          }

          if (error.code === 11000) {
            return res.status(400).render("auth/signup", {
              errorMessage:
                "name need to be unique. The name you chose is already in use.",
            });
          }
          return res
            .status(500)
            .render("auth/signup", { errorMessage: error.message });
        });
    });
  }
);

router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

router.post("/login", isLoggedOut, (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).render("auth/login", {
      errorMessage: "Please provide your email.",
    });
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 8) {
    return res.status(400).render("auth/login", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }

  // Search the database for a user with the email submitted in the form
  User.findOne({ email })
    .then((user) => {
      // If the user isn't found, send the message that user provided wrong credentials
      if (!user) {
        return res.status(400).render("auth/login", {
          errorMessage: "Wrong credentials.",
        });
      }

      // If user is found based on the email, check if the in putted password matches the one saved in the database
      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res.status(400).render("auth/login", {
            errorMessage: "Wrong credentials.",
          });
        }
        req.session.user = user;
        req.app.locals.currentUser = user;
        // req.session.user = user._id; // ! better and safer but in this case we saving the entire user object
        return res.redirect("/");
      });
    })

    .catch((err) => {
      // in this case we are sending the error handling to the error handling middleware that is defined in the error handling file
      // you can just as easily run the res.status that is commented out below
      next(err);
      // return res.status(500).render("login", { errorMessage: err.message });
    });
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .render("auth/logout", { errorMessage: err.message });
    }
    res.redirect("/");
  });
});



router.get("/auth", (req, res) => {
  res.render("auth/error");
});


module.exports = router;
