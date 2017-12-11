/**
 * Created by twanv on 4-12-2017.
 */
var express = require('express');
const CitiesController = require('../../controllers/cities_controller');

module.exports = (app) => {
    app.get('/api/v1/cities', CitiesController.get);

    app.get('/api/v1/cities/:id', CitiesController.getId);

    app.post('/api/v1/cities', CitiesController.create);

    app.put('/api/v1/cities/:id', CitiesController.edit);

    app.delete('/api/v1/cities/:id', CitiesController.delete);
};
