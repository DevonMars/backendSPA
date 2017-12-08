/**
 * Created by twanv on 4-12-2017.
 */
var express = require('express');
const StoresController = require('../../controllers/stores_controller');

module.exports = (app) => {
    app.get('/api/v1/stores', StoresController.get);

    app.post('/api/v1/stores', StoresController.create);

    app.put('/api/v1/stores/:id', StoresController.edit);

    app.delete('/api/v1/stores/:id', StoresController.delete);
};