const express = require("express");
const router = express.Router();

const auctionController = require("../controllers/auction");
const { isAuthenticated } = require("../middleware/authenticate");
router.get("/", auctionController.getAll);

router.get("/user/:id", auctionController.getUserAuctions);

router.get("/:id", auctionController.getSingle);

router.post("/", isAuthenticated, auctionController.createAuction);

router.post("/list", isAuthenticated, auctionController.getFavoriteAuctions);

router.put("/:id", isAuthenticated, auctionController.updateAuction);

router.delete("/:id", isAuthenticated, auctionController.deleteAuction);

module.exports = router;
