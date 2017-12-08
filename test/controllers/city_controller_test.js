/**
 * Created by twanv on 4-12-2017.
 */
const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');

const City = mongoose.model('city');

describe('Cities controller', () => {

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