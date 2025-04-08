const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("./data/database");
const passport = require("passport");
const session = require("express-session");
const GitHubStrategy = require("passport-github2").Strategy;
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8080;

// --- Middleware ---
app.use(bodyParser.json());

// CORS for frontend on Render
app.use(
  cors({
    origin: "https://sports-stop-frontend.onrender.com",
    credentials: true,
  })
);

// Session setup
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Optional: respond to preflight requests
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

// --- Auth Routes ---
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
    session: true,
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

// --- Your app routes (add them after auth setup) ---
app.use("/", require("./routes/index.js"));

// --- DB Init + Server Start ---
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
