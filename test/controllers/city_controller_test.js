/**
 * Created by twanv on 4-12-2017.
 */
const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');

const City = mongoose.model('city');

describe('Cities controller', () => {

    it('Get to /api/cities gets all cities', (done) => {

        const city = new City({title: 'Tilburg'});

        city.save().then(() => {
            request(app)
                .get('/api/v1/cities')
                .then((response) => {
                console.log("city: " + JSON.stringify(response.body));
                    assert(response.body[0].title === 'Tilburg');
                    done();
                });
        });

    });

    it('Get to /api/cities/:id gets one city', (done) => {

        const city = new City({title: 'Tilburg'});

        city.save().then(() => {
            request(app)
                .get(`/api/v1/cities/${city._id}`)
                .then((response) => {
                    console.log("city: " + JSON.stringify(response.body._id));
                    assert(response.body._id === city._id.toString());
                    done();
                });
        });

    });

    it('Post to /api/cities creates a new city', (done) => {
        City.count().then(count => {
            request(app)
                .post('/api/v1/cities')
                .send({
                    title: 'Tilburg',
                    description: 'mooie stad'
                })
                .end(() => {
                    City.count().then(newCount => {
                        console.log('count: ' + newCount);
                        assert(count + 1 === newCount);
                        done();
                    });
                });
        });
    });

    it('Put to /cities/:id edits an existing city', (done) => {
        const city = new City({title: 'Tilburg', description: 'lelijk'});

        city.save().then(() => {
            request(app)
                .put(`/api/v1/cities/${city._id}`)
                .send({description: 'mooi'})
                .end(() => {
                    City.findOne({title: 'Tilburg'})
                        .then(city => {
                            console.log('city: ' + city.title);
                            assert(city.description === 'mooi');
                            done();
                        });
                });
        });
    });

    it('Delete to /cities deletes an existing city', (done) => {
        const city = new City({title: 'Tilburg'});

        city.save().then(() => {
            request(app)
                .delete(`/api/v1/cities/${city._id}`)
                .end(() => {
                    City.findOne({title: 'Tilburg'})
                        .then((city) => {
                            assert(city === null);
                            done();
                        })
                });
        });
    });
});