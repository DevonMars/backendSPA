/**
 * Created by twanv on 4-12-2017.
 */
var express = require('express');
const BeersController = require('../../controllers/beers_controller');

module.exports = (app) => {
    app.get('/api/v1/beers', BeersController.get);

    app.post('/api/v1/beers', BeersController.create);

    app.put('/api/v1/beers/:id', BeersController.edit);

    app.delete('/api/v1/beers/:id', BeersController.delete);
};