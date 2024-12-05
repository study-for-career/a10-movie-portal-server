const express = require('express');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


// BUy5YBTpUONGe247

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://mdzahidulislambera:BUy5YBTpUONGe247@cluster0.b8foj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        const userCollection = client.db('userHub').collection('userCollection');

        app.get('/', (req, res) => {
            res.send('Hello Server')
        })

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email)
            const query = { email }
            const result = await userCollection.findOne(query);
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const user = req.body;

            const result = await userCollection.insertOne(user)
            res.send(result)
        })
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.listen(port, () => {
    console.log('server is running')
})