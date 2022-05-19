// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");


hbs.registerHelper("ifEquals", function (arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper("notEquals", function (arg1, arg2, options) {
  return arg1 != arg2 ? options.fn(this) : options.inverse(this);
});

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const capitalized = require("./utils/capitalized");
const projectName = "switch";

app.locals.appTitle = `${capitalized(projectName)}`;

// 👇 Start handling routes here
const index = require("./routes/index.routes");
app.use("/", index);

const authRoutes = require("./routes/auth.routes");
app.use("/", authRoutes);

const userRoutes = require("./routes/user.routes");
app.use("/", userRoutes);

const adsRoutes = require("./routes/ads.routes");
app.use("/", adsRoutes);

const commentsRoutes = require("./routes/comments.routes");
app.use("/", commentsRoutes);

const requestsRoutes = require("./routes/requests.routes");
app.use("/", requestsRoutes);
// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
