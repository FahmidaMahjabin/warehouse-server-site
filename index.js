const express = require("express");
const cors = require("cors");
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());
// mongodb connected

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.dfsqs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("warehouse").collection("itemDetail");
//   // perform actions on the collection object
//   console.log("mongo connected")
//   client.close();
// });
async function  run(){
    await client.connect();
    const itemCollection = client.db("warehouse").collection("itemDetail");
    try{
        app.get("/inventory", async(req, res) =>{
            const cursor = itemCollection.find({});
            const result = await cursor.toArray();
            res.send(result)

        })
        // make an individual API for 
        // step1:id database er collection e find korbo 
        // step2:response send korbo
        app.get("/inventory/:id", async (req, res) =>{
            const {id} = req.params;
            console.log("id", id);
            const query = {_id: ObjectId(id)}
            const item =await itemCollection.findOne(query)
            res.send(item)

        })
        


    }
    finally{

    }

}
run().catch(console.dir)
app.listen(port, ()=>{
    console.log(`port is running ${port}`)
})
