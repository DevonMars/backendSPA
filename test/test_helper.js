/**
 * Created by twanv on 4-12-2017.
 */

const mongoose = require('mongoose');
const config = require('../config/env/env');

mongoose.Promise = global.Promise;

before((done) => {
    mongoose.connect('mongodb://' + config.env.dbHost + ':' + config.env.dbPort + '/' + config.env.dbDatabase);
    mongoose.connection
        .once("open", () => done())
        .on("error", (error) => {
            console.warn('Warning', error);
        });
});


beforeEach((done) => {
    const { citys, stores, beers } = mongoose.connection.collections;
    citys.drop(() => {
        stores.drop(() => {
            beers.drop(() => {
                done();
            });
        });
    });
});

// fat arrow =>     skinny arrow ->