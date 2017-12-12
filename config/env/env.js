var env = {
    webPort: process.env.PORT || 3000,
    mongodbHost: process.env.DB_HOST || 'localhost',
    mongodbPort: process.env.DB_PORT || '',
    mongodbUser: process.env.DB_USER || '',
    mongodbPassword: process.env.DB_PASSWORD || '',
    mongodbDatabase: process.env.DB_DATABASE || 'wijbieren',
    neo4jHost: process.env.NEO4J_DB_HOST || 'localhost',
    neo4jPort: process.env.NEO4J_DB_PORT || '',
    neo4jUser: process.env.NEO4J_DB_USER || 'neo4j',
    neo4jPassword: process.env.NEO4J_DB_PASSWORD || '91h8472dUp#3',
}

var mongodburl = process.env.NODE_ENV === 'production' ?
    'mongodb://' + env.mongodbUser + ':' + env.mongodbPassword + '@' + env.mongodbHost + ':' + env.mongodbPort + '/' + env.mongodbDatabase :
    'mongodb://localhost/' + env.mongodbDatabase;

var neo4jhost = process.env.NODE_ENV === 'production' ?
    'bolt://' + env.neo4jHost + ':' + env.neo4jPort :
    'bolt://' + env.neo4jHost;


module.exports = {
    env: env,
    mongodburl: mongodburl,
    neo4jhost: neo4jhost
};