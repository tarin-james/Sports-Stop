const router = require("express").Router();
const passport = require("passport");

router.use("/", require("./swagger"));

router.use("/auctions", require("./auction"));

router.use("/users", require("./users"));

router.use("/reviews", require("./reviews"));

router.use("/stores", require("./stores"));

router.get("/login", passport.authenticate("github"), (req, res) => {});

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("https://sports-stop-frontend.onrender.com");
  });
});

module.exports = router;

// "project-2-jyme.onrender.com"
