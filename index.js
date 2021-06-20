const express = require('express')
const app = express()
const port = 4000
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors')
app.use(cors());
app.use(express.json())

require('dotenv').config()


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.do2zp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const jobCollection = client.db("job-seeking").collection("jobList");
    const appliedJobCollection = client.db("job-seeking").collection("AppliedJob");

    app.get('/jobList', (req, res) => {
        jobCollection.find({})
            .toArray((err, documents) => {

                res.send(documents)
            })
    })
    app.get('/job/:id',(req,res)=>{
        const id = req.params.id;
        jobCollection.find({_id: ObjectID(id)}).toArray((err,documents)=>{
          res.send(documents[0])
        })
      })
      app.post('/applyJob',(req,res)=>{
        const appliedJobs = req.body;
        appliedJobCollection.insertOne(appliedJobs,(err,result)=>{
            console.log(err,result);
            res.send({count: result.insertedCount})

        })
    })
    app.post('/addJob',(req,res)=>{
        const Jobs = req.body;
        jobCollection.insertOne(Jobs,(err,result)=>{
            console.log(err,result);
            res.send({count: result.insertedCount})

        })
    })
   

    // app.post('/addJob',(req,res)=>{
    //     const jobs = req.body;
    //     jobCollection.insertMany(jobs,(err,result)=>{
    //         console.log(err,result);
    //         res.send({count: result})

    //     })
    // })
   
    app.get('/', (req, res) => {
        res.send('Hello World!')
    })

});


app.listen(port)
