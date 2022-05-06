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
        app.get("/", (req, res) =>{
            res.send("It's Home")
        })
        app.get("/inventory", async(req, res) =>{
            const cursor = itemCollection.find({});
            const result = await cursor.toArray();
            console.log("inventory get method")
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
        // update the delevired
        //step1: inventory/id te update korbo
        //step2: id diye khuje ber korbo 
        // step3:jei req.body ta pabo ta res e send korbo
        app.put("/inventory/:id", async(req, res) =>{
            const {id} = req.params;
            const query = {_id: ObjectId(id)};
            const option = {upsert: true};
            
            // const item = await itemCollection.findOne(query);
            // const quantity = item.quantity
            // const quantity = parseInt(req.body.quantity);
            
            // console.log("quantity:", quantity)
            const updateDocument = {
                $set : req.body
            }
            const result = await itemCollection.updateOne(query, updateDocument, option)
            res.send(result)
        })

        


    }
    finally{

    }

}
run().catch(console.dir)
app.listen(port, ()=>{
    console.log(`port is running ${port}`)
})
