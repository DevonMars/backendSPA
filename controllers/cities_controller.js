/**
 * Created by twanv on 4-12-2017.
 */
const City = require('../models/city.model');

module.exports = {

    get(req, res, next) {
        City.find({})
            .then((cities) => {
                // console.log(users);
                res.status(200).json(cities);
            })
            .catch((error) => res.status(400).send({error: error.message}));
    },

    create(req, res, next) {
        const cityProps = req.body;
        City.create(cityProps)
            .then(city => res.status(201).send(city))
            .catch((error) => res.status(400).send({error: error.message}));
    },

    edit(req, res, next) {
        const cityId = req.params.id;
        const cityProps = req.body;

        City.findByIdAndUpdate({_id: cityId}, cityProps)
            .then(() => City.findById({_id: cityId}))
            .then(city => res.status(201).send(city))
            .catch((error) => res.status(400).send(({error: error.message})));
    },

    delete(req, res, next) {
        const cityId = req.params.id;

        City.findByIdAndRemove({_id: cityId})
            .then(city => res.status(202).send(city))
            .catch((error) => res.status(404).send({error: error.message}));
    }
};
