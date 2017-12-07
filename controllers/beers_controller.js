/**
 * Created by twanv on 4-12-2017.
 */
const Beer = require('../models/store.model');
var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "91h8472dUp#3"));
var session = driver.session();



module.exports = {

    get(req, res, next) {

        session
            .run(
                    "MATCH (a:Beer)-[:BREWED_IN]->(b:Brewery), " +
                    "(a)-[:IS_OF_KIND]->(k:Kind), " +
                    "(a)-[:HAS_PERCENTAGE]->(p:Alcohol) " +
                    "RETURN a AS beer, b AS Brewery, k AS Kind, p AS Alcohol"
                )
            .then((result) => {
            var beers = [];
                result.records.forEach((record) => {

                    beers.push({
                        _id: record._fields[0].properties._id,
                        brand: record._fields[0].properties.brand,
                        imagePath: record._fields[0].properties.imagePath,
                        brewery: record._fields[1].properties.name,
                        kind: record._fields[2].properties.name,
                        percentage: record._fields[3].properties.percentage
                    });
                });
                res.status(200).send(beers);
            })
            .catch((error) => res.status(400).send({error: error.message}));
    },

    create(req, res, next) {
        const beerProps = req.body;
        const imagePath = beerProps.imagePath;
        const id = beerProps._id;
        const brand = beerProps.brand;
        const kind = beerProps.kind;
        const percentage = beerProps.percentage;
        const brewery = beerProps.brewery;

        session.run(
            "CREATE (beer:Beer{brand: {brandParam}, _id: {idParam}, imagePath: {imageParam}}) " +
            "MERGE (kind:Kind{name: {kindParam}}) " +
            "MERGE (beer)-[:IS_OF_KIND]->(kind) " +
            "MERGE (percentage:Alcohol{percentage: {percentageParam}}) " +
            "MERGE (beer)-[:HAS_PERCENTAGE]->(percentage) " +
            "MERGE (brewery:Brewery{name: {breweryParam}}) " +
            "MERGE (beer)-[:BREWED_IN]->(brewery) " +
            "RETURN beer, kind, percentage, brewery;",
            {imageParam: imagePath, idParam: id, brandParam: brand, kindParam: kind,
                percentageParam: percentage, breweryParam: brewery
            }
        )
        .then((result) => {
            var beer = {};
            result.records.forEach((record) => {

                beer = {
                    _id: record._fields[0].identity.low,
                    brand: record._fields[0].properties.brand,
                    imagePath: record._fields[0].properties.imagePath,
                    brewery: record._fields[1].properties.name,
                    kind: record._fields[2].properties.name,
                    percentage: record._fields[3].properties.percentage
                };
            });
            res.status(200).send(beer);
        })
        .catch((error) => {
            console.log(error);
            res.status(400).send({error: error.message})
        });
        // Beer.create(beerProps)
        //     .then(beer => res.status(201).send(beer))
        //     .catch((error) => res.status(400).send({error: error.message}));
    },

    edit(req, res, next) {
        const beerId = req.params.id;
        const beerProps = req.body;

        Beer.findByIdAndUpdate({_id: beerId}, beerProps)
            .then(() => Beer.findById({_id: beerId}))
            .then(beer => res.status(201).send(beer))
            .catch((error) => res.status(400).send(({error: error.message})));
    },

    delete(req, res, next) {
        const beerId = req.params.id;

        Beer.findByIdAndRemove({_id: beerId})
            .then(beer => res.status(202).send(beer))
            .catch((error) => res.status(404).send({error: error.message}));
    }
};