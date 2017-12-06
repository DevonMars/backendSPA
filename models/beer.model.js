/**
 * Created by twanv on 4-12-2017.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BeerSchema = new Schema({
    brand: String,
    stores: [{
        type: Schema.Types.ObjectId,
        ref: 'store'
    }]
}, {
    timestamps: true
});

const Beer = mongoose.model('beer', BeerSchema);

module.exports = Beer;