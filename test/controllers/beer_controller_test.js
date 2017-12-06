/**
 * Created by twanv on 4-12-2017.
 */

const assert = require('assert');
const request = require('supertest');
const app = require('../../server');
const mongoose = require('mongoose');
const Beer = mongoose.model('beer');





describe('Stores controller', () => {

    it('Post to /beers creates a new beer', (done) => {
        Beer.count().then(count => {
            request(app)
                .post('/beers')
                .send({
                    title: 'De BierFanaat',
                    address: 'PiempeloerusStraat 43'
                })
                .end(() => {
                    Beer.count().then(newCount => {
                        console.log('count: ' + newCount);
                        assert(count + 1 === newCount);
                        done();
                    });
                });
        });
    });

    it('Put to /stores/:id edits an existing store', (done) => {
        const store = new Beer({title: 'De BierFanaat', address: 'PiempeloerusStraat 43'});

        store.save().then(() => {
            request(app)
                .put(`/stores/${store._id}`)
                .send({address: 'BierBuik 23'})
                .end(() => {
                    Beer.findOne({title: 'De BierFanaat'})
                        .then(store => {
                            console.log('city: ' + store.title);
                            assert(store.address === 'BierBuik 23');
                            done();
                        });
                });
        });
    });

    it('Delete to /stores/:id deletes an existing store', (done) => {
        const store = new Beer({title: 'De BierFanaat'});

        store.save().then(() => {
            request(app)
                .delete(`/stores/${store._id}`)
                .end(() => {
                    Beer.findOne({title: 'De BierFanaat'})
                        .then((store) => {
                            assert(store === null);
                            done();
                        })
                });
        });
    });
});