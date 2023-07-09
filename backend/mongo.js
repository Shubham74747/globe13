const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const getConn = async () => {
    return await client.connect();
}

const closeConn = async () => {
    await client.close();
}

module.exports = { getConn, closeConn }
