const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['Stores']
    const result = await mongodb.getDatabase().db().collection('stores').find();
    result.toArray().then((stores) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(stores);
    });
};

const getSingle = async (req, res) => {
    //#swagger.tags=['Stores']
    const storeId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('stores').find( { _id: storeId });
    result.toArray().then((stores) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(stores)[0];
    });
};

const createStore = async (req, res) => {
    //#swagger.tags=['Stores']
    const store = {
        storeId: req.body.storeId,
        storeName: req.body.storeName,
        rating: req.body.rating,
        itemId: req.body.itemId
    }
    const response = await mongodb.getDatabase().db().collection('stores').insertOne(store);
    if (response.acknowledged > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while creating the Store.');
    }
};

const updateStore = async (req, res) => {
    //#swagger.tags=['Stores']
    const storeId = new ObjectId(req.params.id);
    const store = {
        storeId: req.body.storeId,
        storeName: req.body.storeName,
        rating: req.body.rating,
        itemId: req.body.itemId
    }
    const response = await mongodb.getDatabase().db().collection('stores').replaceOne({ _id: storeId }, store);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while updating the Store.');
    }
};

const deleteStore = async (req, res) => {
    //#swagger.tags=['Stores']
    const storeId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('stores').deleteOne({ _id: storeId });
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while deleting the Store.');
    }
}



module.exports = {
    getAll,
    getSingle, 
    createStore,
    updateStore,
    deleteStore
}