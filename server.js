const express = require('express');
const cors = require('cors');

const app = express();

//mongodb
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://limonroy19cse013:HTTLOs0QJLrqQOVi@cluster0.e7brj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
// const uri = 'mongodb+srv://limonroy19cse013:TDXtyqiV0UNGmkpT@cluster0.o5wvf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
// HTTLOs0QJLrqQOVi
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
        //  await client.connect();
    
        ///create a collection of documents
        const database = client.db('alphaconsultaion');
        const patientCollection = database.collection('patients')
        const AppoinmentCollection = database.collection('Appoinments')

  
        //Patients add
        app.post('/api/patients',async(req,res)=>{
            const patients = req.body
            const result = await patientCollection.insertOne(patients)
            res.send(result)
        })
        app.get('/api/patients',async(req,res)=>{
        
            const result=await patientCollection.find().toArray();
            res.send(result);
          })
        // appoinment add
        app.post("/api/appoinments",async(req,res)=>{
            const appoinment = req.body;
            const result = await AppoinmentCollection.insertOne(appoinment);
            res.send(result)
        })
    
      // Send a ping to confirm a successful connection
      //sawait client.db("admin").command({ ping: 1 });
      //console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
    }
  }
  run().catch(console.dir);



// Define routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
