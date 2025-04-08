const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("./data/database");
const passport = require("passport");
const session = require("express-session");
const GitHubStrategy = require("passport-github2").Strategy;
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8080;

// CORS MUST come first
app.use(cors({
  origin: "https://sports-stop-frontend.onrender.com",
  credentials: true
}));

// Body parser
app.use(bodyParser.json());

// Session config — secure & cross-origin
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,             // must be true on HTTPS/Render
    httpOnly: true,
    sameSite: "none"          // required for cross-site cookies
  }
}));

// Passport config
app.use(passport.initialize());
app.use(passport.session());

// MongoDB init
mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Database is listening and node running on port ${port}`);
    });
  }
});

// GitHub OAuth setup
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Routes
app.get("/", (req, res) => {
  res.send(
    req.session.user
      ? `Logged in as ${req.session.user.displayName}`
      : "Logged Out"
  );
});

app.get("/auth", (req, res) => {
  if (req.session.user) {
    res.status(200).json(req.session.user);
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

app.get("/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/api-docs"
    // Removed session: false
  }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect("https://sports-stop-frontend.onrender.com");
  }
);

app.use("/", require("./routes/index.js"));

module.exports = app;
