/**
 * Created by twanv on 4-12-2017.
 */
const Beer = require('../models/beer.model');
var session = require('../config/neo4j/neo4j');


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
                session.close();
                res.status(200).send(beers);
            })
            .catch((error) => res.status(400).send({error: error.message}));
    },

    getId(req, res, next) {

        const id =req.params.id;

        session
            .run(
                "MATCH (a:Beer)-[:BREWED_IN]->(b:Brewery), " +
                "(a)-[:IS_OF_KIND]->(k:Kind), " +
                "(a)-[:HAS_PERCENTAGE]->(p:Alcohol) " +
                "WHERE a._id = {idParam}" +
                "RETURN a AS beer, b AS Brewery, k AS Kind, p AS Alcohol",
                {idParam: id}
            )
            .then((result) => {
                var beer = {};
                result.records.forEach((record) => {

                    beer = {
                        _id: record._fields[0].properties._id,
                        brand: record._fields[0].properties.brand,
                        imagePath: record._fields[0].properties.imagePath,
                        brewery: record._fields[1].properties.name,
                        kind: record._fields[2].properties.name,
                        percentage: record._fields[3].properties.percentage
                    };
                });
                session.close();
                res.status(200).send(beer);
            })
            .catch((error) => res.status(400).send({error: error.message}));
    },

    create(req, res, next) {
        const beerProps = req.body;
        const imagePath = beerProps.imagePath;
        var id = '';
        const brand = beerProps.brand;
        const kind = beerProps.kind;
        const percentage = beerProps.percentage;
        const brewery = beerProps.brewery;

        const mongoDbBeerProps = {
            imagePath: imagePath,
            brand: brand,
            kind: kind,
            percentage: percentage,
            brewery: brewery
        };

        Beer.create(mongoDbBeerProps)
            .then(beer => {
                id = beer._id.toString();
                console.log(id);

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
                                _id: record._fields[0].properties._id,
                                brand: record._fields[0].properties.brand,
                                imagePath: record._fields[0].properties.imagePath,
                                kind: record._fields[1].properties.name,
                                percentage: record._fields[2].properties.percentage,
                                brewery: record._fields[3].properties.name
                            };
                        });
                        session.close();
                        res.status(200).send(beer);
                    })
                    .catch((error) => {
                        console.log(error);
                        res.status(400).send({error: error.message})
                    });
            })
            .catch((error) => res.status(400).send({error: error.message}));


    },

    edit(req, res, next) {
        const beerId = req.params.id + '';
        const beerProps = req.body;
        const imagePath = beerProps.imagePath;
        const brand = beerProps.brand;
        const kind = beerProps.kind;
        const percentage = beerProps.percentage;
        const brewery = beerProps.brewery;

        Beer.findByIdAndUpdate({_id: beerId}, beerProps)
            .then(() => Beer.findById({_id: beerId}))
            .then(() => {
                session
                    .run(
                        "MATCH (beer:Beer{_id: {idParam}}) " +
                        "OPTIONAL MATCH (beer)-[rel]-() " +
                        "DELETE rel ",
                        {idParam: beerId}
                    )
                    .then(() => {
                        console.log("all relations to beer with id: " + beerId + " have been removed");

                        session
                            .run(
                                "MATCH (beer:Beer{_id: {idParam}}) " +
                                "SET beer.brand = {brandParam} " +
                                "MERGE (kind:Kind{name: {kindParam}}) " +
                                "MERGE (beer)-[:IS_OF_KIND]->(kind) " +
                                "MERGE (percentage:Alcohol{percentage: {percentageParam}}) " +
                                "MERGE (beer)-[:HAS_PERCENTAGE]->(percentage) " +
                                "MERGE (brewery:Brewery{name: {breweryParam}}) " +
                                "MERGE (beer)-[:BREWED_IN]->(brewery) " +
                                "RETURN beer, kind, percentage, brewery;",
                                {imageParam: imagePath, idParam: beerId, brandParam: brand, kindParam: kind,
                                    percentageParam: percentage, breweryParam: brewery
                                }
                            )
                            .then((result) => {
                                var beer = {};
                                result.records.forEach((record) => {

                                    beer = {
                                        _id: record._fields[0].properties._id,
                                        brand: record._fields[0].properties.brand,
                                        imagePath: record._fields[0].properties.imagePath,
                                        brewery: record._fields[1].properties.name,
                                        kind: record._fields[2].properties.name,
                                        percentage: record._fields[3].properties.percentage
                                    };
                                });
                                session.close();
                                res.status(200).send(beer);
                            })
                    })
                    .catch((error) => res.status(400).send(({error: error.message})));
            })
            .catch((error) => res.status(400).send(({error: error.message})));




    },

    delete(req, res, next) {
        var beerId = req.params.id;

        Beer.findByIdAndRemove({_id: beerId})
            .then(beer => {
                // res.status(202).send(beer);

                session
                    .run(
                        "MATCH (beer:Beer{_id: {idParam}}) " +
                        "OPTIONAL MATCH (beer)-[rel]-() " +
                        "DELETE beer, rel",
                        {idParam: beerId}
                    )
                    .then(() => {
                        console.log('Beer has been removed');
                        session.close();
                        let json = JSON.stringify({_id: beer._id, brand: beer.brand});
                        res.status(202).send(json);

                    })
                    .catch((error) => res.status(404).send({error: error.message}));
            })
            .catch((error) => res.status(404).send({error: error.message}));


    }


};