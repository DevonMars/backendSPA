/**
 * Created by twanv on 7-12-2017.
 */
var config = require('../env/env');
var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver(config.neo4jhost, neo4j.auth.basic(config.env.neo4jUser, config.env.neo4jPassword));
var session = driver.session();

module.exports = session;