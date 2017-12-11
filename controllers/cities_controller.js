/**
 * Created by twanv on 4-12-2017.
 */
const City = require('../models/city.model');

module.exports = {

    get(req, res, next) {
        City.find({})
            .populate('stores')
            .then((cities) => {
                // console.log(users);
                res.status(200).json(cities);
            })
            .catch((error) => res.status(400).send({error: error.message}));
    },

    getId(req, res, next) {
        const cityId = req.params.id;

        City.findOne({_id: cityId})
            .populate('stores')
            .then((city) => {
                // console.log(users);
                res.status(200).json(city);
            })
            .catch((error) => res.status(400).send({error: error.message}));
    },

    create(req, res, next) {
        const body = req.body;
        const title = body.title;
        const description = body.description;
        const province = body.province;
        const imagePath = body.imagePath;
        const stores = body.stores;

        const cityProps = {
            title: title,
            description: description,
            province: province,
            imagePath: imagePath,
            stores: stores
        };


        City.create(cityProps)
            .then(city => res.status(201).send(city))
            .catch((error) => res.status(400).send({error: error.message}));
    },

    edit(req, res, next) {
        const cityId = req.params.id;
        const cityProps = req.body;

        City.findByIdAndUpdate({_id: cityId}, cityProps)
            .then(() => City.findById({_id: cityId}).populate('stores'))
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
