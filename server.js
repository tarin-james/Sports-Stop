const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("./data/database");

const app = express();
const port = process.env.PORT || 8080;

const passport = require("passport");
const session = require("express-session");
const GitHubStrategy = require("passport-github2").Strategy;
const cors = require("cors");

const isProduction = process.env.NODE_ENV === "production";

app
  .use(bodyParser.json())
  .use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: isProduction, // true in production with HTTPS
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax", // 'none' for cross-site cookies
      },
    })
  )
  .use(
    cors({
      origin: "https://sports-stop-frontend.onrender.com",
      credentials: true,
    })
  )
  .use(passport.initialize())
  .use(passport.session())
  .use("/", require("./routes/index.js"));

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get("/", (req, res) => {
  res.send(
    req.session.user !== undefined
      ? `Logged in as ${req.session.user.displayName}`
      : "Logged Out"
  );
});

app.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/api-docs",
    // session: false REMOVED so user is saved in session
  }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect("https://sports-stop-frontend.onrender.com");
  }
);

app.get("/auth", (req, res) => {
  if (req.session.user) {
    res.status(200).json(req.session.user);
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Database is listening and node Running on port ${port}`);
    });
  }
});

module.exports = app;
