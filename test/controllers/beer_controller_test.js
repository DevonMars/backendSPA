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
        const beer = new Beer({brand: 'Heineken'});
        const id = beer._id.toString();
        console.log('beer-_id: ' + id);
        const brand = beer.brand;

        beer.save().then(() => {
            request(app)
                .put(`/api/v1/beers/${id}`)
                .send({brand: 'Heineken2'})
                .end(() => {
                    Beer.findOne({brand: 'Heineken2'})
                        .then(updatedBeer => {
                            console.log(id);
                            console.log(updatedBeer._id);
                            assert(updatedBeer._id.toString() === id);
                            done();

                        });
                });
        });

        // session.run(
        //     "CREATE (beer:Beer{brand: {brandParam}, _id: {idParam}})",
        //     {idParam: id, brandParam: brand}
        // )
    });

    it('Delete to /beers/:id deletes an existing beer', (done) => {
        const beer = new Beer({brand: 'De BierFanaat'});

        beer.save().then(() => {
            request(app)
                .delete(`/api/v1/beers/${beer._id}`)
                .end(() => {
                    Beer.findOne({brand: 'De BierFanaat'})
                        .then((beer) => {
                            assert(beer === null);

                            session
                                .run(
                                    "MATCH (n:Beer{brand: 'De BierFanaat'}) RETURN n"
                                )
                                .then((result) => {

                                    assert(result.records.length === 0);
                                    done();
                                })
                        });

                });

        });
    });
});