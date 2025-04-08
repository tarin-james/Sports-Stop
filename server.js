const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("./data/database");
const passport = require("passport");
const session = require("express-session");
const GitHubStrategy = require("passport-github2").Strategy;
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8080;

// --- Middleware Setup ---
app.use(bodyParser.json());

// CORS comes first
app.use(
  cors({
    origin: "https://sports-stop-frontend.onrender.com",
    credentials: true,
  })
);

// Session config
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, // must be true for HTTPS on Render
      httpOnly: true,
      sameSite: "none", // allows cross-origin cookies
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Allow preflight requests
app.options("*", cors());

// --- Passport GitHub Strategy ---
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

// --- Routes ---
app.get("/", (req, res) => {
  res.send(
    req.isAuthenticated()
      ? `Logged in as ${req.user.displayName}`
      : "Logged Out"
  );
});

app.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/api-docs",
    session: true, // must be true to persist session
  }),
  (req, res) => {
    res.redirect("https://sports-stop-frontend.onrender.com");
  }
);

app.get("/auth", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

// --- MongoDB then Start Server ---
mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Database connected and server running on port ${port}`);
    });
  }
});

module.exports = app;
