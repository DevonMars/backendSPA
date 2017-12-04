/**
 * Created by twanv on 4-12-2017.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StoreSchema = new Schema({
    title: String,
    address: String,
    beers: [{
        type: Schema.Types.ObjectId,
        ref: 'beer'
    }]
}, {
    timestamps: true
});

const Store = mongoose.model('store', StoreSchema);

module.exports = Store;