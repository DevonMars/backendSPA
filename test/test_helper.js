/**
 * Created by twanv on 4-12-2017.
 */

const mongoose = require('mongoose');
const config = require('../config/env/env');



before((done) => {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/wijbieren_test');
    mongoose.connection
        .once('open', () => {
            console.log('Connected to Mongo on wijbieren_test');
            done();
        })
        .on("error", (error) => {
            console.warn('Warning', error);
        });
});


beforeEach((done) => {
    const { cities, stores, beers } = mongoose.connection.collections;
    cities.drop(() => {
        stores.drop(() => {
            done();
        });

    });
});

// fat arrow =>     skinny arrow ->