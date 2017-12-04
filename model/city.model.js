/**
 * Created by twanv on 4-12-2017.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CitySchema = new Schema({
    title: String,
    description: String,
    province: String,
    stores: [{
        type: Schema.Types.ObjectId,
        ref: 'store'
    }]
}, {
    timestamps: true
});

// adding pre middleware to save() on User model.
// CitySchema.pre('remove', function(next) {
//     //this === joe
//     // fat arrow function doesnt allow you to find this. this is thr whole document scope
//     // with fat arrow function
//     const Store = mongoose.model('store');
//
//     Store.remove({_id: {$in: this.}})
//         .then(() => next()); // call next which confirms that this middleware completed
//     // after this next the next middleware can be fired. this remove() is asynchronous.
//
// });

const City = mongoose.model('city', CitySchema);

module.exports = City;