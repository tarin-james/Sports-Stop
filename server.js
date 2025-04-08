const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("./data/database");

const app = express();
const port = process.env.PORT || 8080;
mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Database is listening and node Running on port ${port}`);
    });
  }
});
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const GitHubStrategy = require("passport-github2").Strategy;
const cors = require("cors");

app
  .use(bodyParser.json())
  .use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // true in production with HTTPS
        httpOnly: true,
        sameSite: false, // allows cross-site GETs like /auth
        maxAge: 60 * 60 * 24 * 1000,
        domain: ".onrender.com",
      },
    })
  )
  .use(passport.initialize())
  .use(passport.session())
  .use((req, res, next) => {
    res.setHeader(
      "Access-Control-Allow-Origin",
      "https://sports-stop-frontend.onrender.com"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Z-Key"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
  })
  .use("/", require("./routes/index.js"));

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      //User.findOrCreate({ githubId: profile.id }, function (err, user){
      return done(null, profile);
      //})
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
app.use(cookieParser());

app.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/api-docs",
    session: true,
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

module.exports = app;
