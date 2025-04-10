const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
  //#swagger.tags=['Auctions']
  const result = await mongodb.getDatabase().db().collection("auctions").find();
  result.toArray().then((auctions) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(auctions);
  });
};

const getSingle = async (req, res) => {
  //#swagger.tags=['Auctions']
  const auctionId = new ObjectId(req.params.id);
  const result = await mongodb
    .getDatabase()
    .db()
    .collection("auctions")
    .find({ _id: auctionId });
  result.toArray().then((auctions) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(auctions)[0];
  });
};

const getUserAuctions = async (req, res) => {
  //#swagger.tags=['Auctions']
  const authorId = req.params.id;
  const result = await mongodb
    .getDatabase()
    .db()
    .collection("auctions")
    .find({ authorId: authorId });
  result.toArray().then((auctions) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(auctions);
  });
};

const createAuction = async (req, res) => {
  //#swagger.tags=['Auctions']
  const auction = {
    title: req.body.title,
    condition: req.body.condition,
    currentBid: req.body.currentBid,
    description: req.body.description,
    authorId: req.body.authorId,
    datePosted: req.body.datePosted,
    priceNew: req.body.priceNew,
    images: req.body.images,
    duration: req.body.duration,
  };
  const response = await mongodb
    .getDatabase()
    .db()
    .collection("auctions")
    .insertOne(auction);
  if (response.acknowledged > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(
        response.error || "Some error occurred while creating the auction."
      );
  }
};

const getFavoriteAuctions = async (req, res) => {
  //#swagger.tags=['Auctions']
  const favoriteIds = req.body.favoritesList;

  if (!Array.isArray(favoriteIds)) {
    return res
      .status(400)
      .json({ message: "Favorites must be an array of IDs." });
  }

  try {
    const objectIds = favoriteIds.map((id) => new ObjectId(id));

    const auctions = await mongodb
      .getDatabase()
      .db()
      .collection("auctions")
      .find({ _id: { $in: objectIds } })
      .toArray();

    res.status(200).json(auctions);
  } catch (error) {
    console.error("Error fetching favorite auctions:", error);
    res
      .status(500)
      .json(error || "Some error occurred while retrieving favorite auctions.");
  }
};

const updateAuction = async (req, res) => {
  //#swagger.tags=['Auctions']
  const auctionId = new ObjectId(req.params.id);
  const auction = {
    title: req.body.title,
    condition: req.body.condition,
    currentBid: req.body.currentBid,
    description: req.body.description,
    authorId: req.body.authorId,
    datePosted: req.body.datePosted,
    priceNew: req.body.priceNew,
    duration: req.body.duration,
  };

  if (req.body.images) {
    auction.images = req.body.images;
  }

  if (req.body.comments) {
    auction.comments = req.body.comments;
  }
  const response = await mongodb
    .getDatabase()
    .db()
    .collection("auctions")
    .replaceOne({ _id: auctionId }, auction);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(
        response.error || "Some error occurred while updating the auction."
      );
  }
};

const deleteAuction = async (req, res) => {
  //#swagger.tags=['Auctions']
  const auctionId = new ObjectId(req.params.id);
  const response = await mongodb
    .getDatabase()
    .db()
    .collection("auctions")
    .deleteOne({ _id: auctionId });
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(
        response.error || "Some error occurred while deleting the auction."
      );
  }
};

module.exports = {
  getAll,
  getSingle,
  getUserAuctions,
  createAuction,
  updateAuction,
  deleteAuction,
  getFavoriteAuctions,
};
