/**
 * Created by twanv on 4-12-2017.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CitySchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    province: {type: String, required: true},
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