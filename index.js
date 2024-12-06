require('dotenv').config()
const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b8foj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri)

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
        // await client.connect();
        // Send a ping to confirm a successful connection
        const userCollection = client.db('movie_portal_db').collection('userCollection');
        const movieCollection = client.db('movie_portal_db').collection('movieCollection');
        const favouriteMovies = client.db('movie_portal_db').collection('favouriteMovies');

        app.get('/', (req, res) => {
            res.send('Hello Server')
        })

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const result = await userCollection.findOne(query);
            res.send(result)
        })

        app.get('/movies', async (req, res) => {
            const cursor = movieCollection.find()
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/movies/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await movieCollection.findOne(query);
            res.send(result)
        })

        app.get('/favourite_movies/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const cursor = favouriteMovies.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })


        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user)
            res.send(result)
        })

        app.post('/movies', async (req, res) => {
            const movie = req.body;
            const result = await movieCollection.insertOne(movie)
            res.send(result)
        })

        app.post('/favourite_movies', async (req, res) => {
            const favouriteMovie = req.body;
            const result = await favouriteMovies.insertOne(favouriteMovie)
            res.send(result)
        })

        app.delete('/favourite_movies/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            console.log(query)
            const result = await favouriteMovies.deleteOne(query);
            res.send(result)
        })


        // await client.db("admin").command({ ping: 1 });
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