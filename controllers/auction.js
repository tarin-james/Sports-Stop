const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['Auctions']
    const result = await mongodb.getDatabase().db().collection('auctions').find();
    result.toArray().then((auctions) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(auctions);
    });
};

const getSingle = async (req, res) => {
    //#swagger.tags=['Auctions']
    const auctionId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('auctions').find( { _id: auctionId });
    result.toArray().then((auctions) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(auctions)[0];
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
        priceNew: req.body.priceNew
    }
    const response = await mongodb.getDatabase().db().collection('auctions').insertOne(auction);
    if (response.acknowledged > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while creating the auction.');
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
        priceNew: req.body.priceNew
    }
    const response = await mongodb.getDatabase().db().collection('auctions').replaceOne({ _id: auctionId }, auction);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while updating the auction.');
    }
};

const deleteAuction = async (req, res) => {
    //#swagger.tags=['Auctions']
    const auctionId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('auctions').deleteOne({ _id: auctionId });
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while deleting the auction.');
    }
}



module.exports = {
    getAll,
    getSingle, 
    createAuction,
    updateAuction,
    deleteAuction
}