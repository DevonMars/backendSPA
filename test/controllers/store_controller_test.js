/**
 * Created by twanv on 4-12-2017.
 */

const mongoose = require('mongoose');
const Store = mongoose.model('store');
const assert = require('assert');
const request = require('supertest');

const app = require('../../server');



describe('Stores controller', () => {

    it('Post to /api/stores creates a new store', (done) => {
        Store.count().then(count => {
            request(app)
                .post('/stores')
                .send({
                    title: 'De BierFanaat',
                    address: 'PiempeloerusStraat 43'
                })
                .end(() => {
                    Store.count().then(newCount => {
                        console.log('count: ' + newCount);
                        assert(count + 1 === newCount);
                        done();
                    });
                });
        });
    });

    it('Put to /stores/:id edits an existing store', (done) => {
        const store = new Store({title: 'De BierFanaat', address: 'PiempeloerusStraat 43'});

        store.save().then(() => {
            request(app)
                .put(`/stores/${store._id}`)
                .send({address: 'BierBuik 23'})
                .end(() => {
                    Store.findOne({title: 'De BierFanaat'})
                        .then(store => {
                            console.log('city: ' + store.title);
                            assert(store.address === 'BierBuik 23');
                            done();
                        });
                });
        });
    });

    it('Delete to /stores/:id deletes an existing store', (done) => {
        const store = new Store({title: 'De BierFanaat'});

        store.save().then(() => {
            request(app)
                .delete(`/stores/${store._id}`)
                .end(() => {
                    Store.findOne({title: 'De BierFanaat'})
                        .then((store) => {
                            assert(store === null);
                            done();
                        })
                });
        });
    });
});