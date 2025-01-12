const express = require('express');
const cors = require('cors');

const app = express();

//mongodb
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');

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

        // appoinment add
        app.post("/api/appoinments",async(req,res)=>{
            const appoinment = req.body;
            const result = await AppoinmentCollection.insertOne(appoinment);
            res.send(result)
        })
    
    
  //signup role of users
//   app.post('/api/users', async(req,res)=>{
//     const users= req.body;
//     console.log(users)
  
//    const result = await usersCollection.insertOne(users);
  
//    res.send(result);
//   })
  
  
//   app.get('/api/users',async(req,res)=>{
  
//     const result=await usersCollection.find().toArray();
//     res.send(result);
//   })
  
  
  
  
  //insert donation campign field 
//   app.post('/api/donation-campaign', async(req,res)=>{
//     const newcart = req.body;
  
//    const result = await donateCollection.insertOne(newcart);
  
//    res.send(result);
//   })
  
//   app.get("/api/donation-campaign", async (req, res) => {
//   const cursor = donateCollection.find();
//   const result = await cursor.toArray();
//   res.send(result);
//   }); 
  
  
  
  
   
  
  
  
  
  

  
//     app.post('/api/order', async(req, res) => {
//       try {
//           const orderData = req.body;
//           console.log('Received order data:', orderData);
  
//           // Check if data is empty
//           if (!orderData || Object.keys(orderData).length === 0) {
//               return res.status(400).json({
//                   success: false,
//                   message: 'No order data provided'
//               });
//           }
  
//           // Remove any existing _id field from the order data
//           const { _id, ...orderDataWithoutId } = orderData;
  
//           // Create a new order document
//           const newOrder = {
//               ...orderDataWithoutId,
//               createdAt: new Date(),
//               status: 'pending'
//           };
  
//           // Check database connection
//           if (!orderCollection) {
//               throw new Error('Database collection not initialized');
//           }
  
//           const result = await orderCollection.insertOne(newOrder);
//           console.log('Insert result:', result);
  
//           if (result.acknowledged) {
//               res.status(201).json({
//                   success: true,
//                   message: 'Order created successfully',
//                   orderId: result.insertedId,
//                   data: newOrder
//               });
//           } else {
//               throw new Error('Order creation failed');
//           }
  
//       } catch (error) {
//           console.error('Order creation error:', error);
//           res.status(500).json({
//               success: false,
//               message: 'Failed to create order',
//               error: error.message
//           });
//       }
//   });
  

  
  
  
  
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
