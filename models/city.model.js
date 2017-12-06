/**
 * Created by twanv on 4-12-2017.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CitySchema = new Schema({
    title: String,
    description: String,
    province: String,
    imagePath: String,
    stores: [{
        type: Schema.Types.ObjectId,
        ref: 'store'
    }]
}, {
    timestamps: true
});

const City = mongoose.model('city', CitySchema);

module.exports = City;