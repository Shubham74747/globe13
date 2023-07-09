const { closeConn, getConn } = require("./mongo");

async function run() {
    try {
        const client = await getConn();

        await client.db("admin").command({ ping: 1 });
        console.log("You successfully connected to MongoDB!");

        await client.db("notifier").collection("sentences").drop()
        await client.db("notifier").createCollection("sentences", function (err, res) {
            if (err) {
                console.log("Error while creating collection " + err);
            }
            console.log("Collection created!");
        });

        const sentences = [
            { "id": "123", "title": "Apple", "description": "Apple is good for health" },
            { "id": "124", "title": "Ball", "description": "Ball is used to play" },
            { "id": "125", "title": "Cat", "description": "Cat is so cute" },
            { "id": "126", "title": "Dog", "description": "Dogs are dangerous" },
            { "id": "127", "title": "Elephant", "description": "Elephant has largest heart" }
        ];
        const dbo = client.db("notifier");
        await dbo.collection("sentences").insertMany(sentences, function (err, res) {
            if (err) {
                console.log(err);
            }
            console.log("Number of documents inserted: " + res.insertedCount);
            db.close();
        });
    } finally {
        await closeConn();
    }
}
run().catch(console.dir);
