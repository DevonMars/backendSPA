/**
 * Created by twanv on 4-12-2017.
 */
const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const session = require ('../../config/neo4j/neo4j');

const Beer = mongoose.model('beer');

describe('Beers controller', () => {

    it('Get to /api/beers gets all beers', (done) => {

        request(app)
            .post('/api/v1/beers')
            .send({
                imagePath: '',
                _id: '',
                brand: 'Heineken',
                kind: 'Bruin',
                percentage: '8%',
                brewery: 'HeinekenInc',
            })
            .then(() => {
                request(app)
                    .get('/api/v1/beers')
                    .then((response) => {
                        console.log("beer: " + JSON.stringify(response.body));
                        assert(response.body[0].brand === 'Heineken');
                        done();
                    })
            });

    });

    it('Get to /api/beers/:id gets one beer', (done) => {

        request(app)
            .post('/api/v1/beers')
            .send({
                imagePath: '',
                _id: '',
                brand: 'Heineken',
                kind: 'Bruin',
                percentage: '8%',
                brewery: 'HeinekenInc',
            })
            .then((response) => {
                request(app)
                    .get(`/api/v1/beers/${response.body._id}`)
                    .then((response) => {
                        console.log("beer: " + JSON.stringify(response.body));
                        assert(response.body.brand === 'Heineken');
                        done();
                    })
            });

    });

    it('Post to /beers creates a new beer', (done) => {
        Beer.count().then(count => {
            request(app)
                .post('/api/v1/beers')
                .send({
                    imagePath: '',
                    _id: '',
                    brand: 'Heineken',
                    kind: 'Bruin',
                    percentage: '8%',
                    brewery: 'HeinekenInc',
                })
                .end(() => {
                    Beer.count().then(newCount => {
                        console.log('count: ' + newCount);
                        assert(count + 1 === newCount);

                        session
                            .run(
                                "MATCH (n:Beer) RETURN n"
                            )
                            .then((result) => {
                                assert(result.records.length === 1);
                                done();
                            })
                    });


                });
        });
    });

    it('Put to /beers/:id edits an existing beer', (done) => {

        request(app)
            .post('/api/v1/beers')
            .send({
                imagePath: '',
                _id: '',
                brand: 'Heineken',
                kind: 'Bruin',
                percentage: '8%',
                brewery: 'HeinekenInc',
            })
            .then((response) => {
                request(app)
                    .put(`/api/v1/beers/${response.body._id}`)
                    .send({brand: 'Heineken2'})
                    .then((response) => {
                        assert(response.body.brand === 'Heineken2');
                        const beerId = response.body._id;

                        Beer.findOne({_id: beerId})
                            .then(updatedBeer => {
                                assert(updatedBeer.brand === 'Heineken2');
                                done();
                            });
                    })
            });
    });

    it('Delete to /beers/:id deletes an existing beer', (done) => {


        request(app)
            .post('/api/v1/beers')
            .send({
                imagePath: '',
                _id: '',
                brand: 'Heineken',
                kind: 'Bruin',
                percentage: '8%',
                brewery: 'HeinekenInc',
            })
            .then((response) => {
                request(app)
                    .delete(`/api/v1/beers/${response.body._id}`)
                    .then(() => {
                        Beer.findOne({brand: 'Heineken'})
                            .then((beer) => {
                                assert(beer === null);

                                session
                                    .run(
                                        "MATCH (n:Beer{brand: 'De BierFanaat'}) RETURN n"
                                    )
                                    .then((result) => {

                                        assert(result.records.length === 0);
                                        done();
                                    });
                            });
                    });
            });

    });
});