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
        const DrugCollection = database.collection("Drugs")
  
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
            const appoinnment = req.body;
            const result = await AppoinmentCollection.insertOne(appoinnment);
            res.send(result)
        })
        app.get('/api/appoinments',async(req,res)=>{
            try{
                // Extract the query parameter for filtering
                const { appoinment_status } = req.query;

                // Build the match filter dynamically
                const matchStage = {
                    $match: appoinment_status ? { appoinment_status } : {}
                };
   
                const result=await AppoinmentCollection.aggregate([
                    matchStage,
                    {
                        $addFields: {
                            patient_pid: { $toObjectId: "$patient_pid" } // Convert patient_pid to ObjectId if it's a string
                        }
                    },
                    {
                        $lookup: {
                            from: 'patients',
                            localField: 'patient_pid',
                            foreignField: '_id',
                            as: 'patient_details',
                        }
                    },
                    {
                        $unwind: "$patient_details"  // Flatten the array of patient details
                      },
                      {
                        $project: {
                          _id: 1,
                          patient_pid: 1,
                          chief_complaint: 1,
                          payment_status: 1,
                          service_charge: 1,
                          appoinment_status: 1,
                          patient_type: 1,
                          patientId:"$patient_details.patient_id",
                          patient_name: "$patient_details.patient_name",  // Adjust the patient details as per your patient collection
                          phone_number: "$patient_details.phone_number"  // Adjust as needed
                        }
                      }
                    
                ]).toArray();
                res.send(result);
            }catch (error) {
                console.error('Error fetching appointments:', error);
                res.status(500).send({ error: 'An error occurred while fetching appointments' });
            }
            
        })
        app.get('/api/appoinments/:Id',async(req,res)=>{
            try{
                // Extract the query parameter for filtering
                const { Id } = req.params;


                // Validate the ID
                if (!Id || !ObjectId.isValid(Id)) {
                    return res.status(400).send({ error: 'Invalid appointment ID' });
                }
   
                const result=await AppoinmentCollection.aggregate([
                    {
                        $match: { _id: new ObjectId(Id) } // Match the appointment by its ID
                    },
                    {
                        $addFields: {
                            patient_pid: { $toObjectId: "$patient_pid" } // Convert patient_pid to ObjectId if it's a string
                        }
                    },
                    {
                        $lookup: {
                            from: 'patients',
                            localField: 'patient_pid',
                            foreignField: '_id',
                            as: 'patient_details',
                        }
                    },
                    {
                        $unwind: "$patient_details"  // Flatten the array of patient details
                      },
                      {
                        $project: {
                            _id: 1,
                            patient_pid: 1,
                            chief_complaint: 1,
                            payment_status: 1,
                            service_charge: 1,
                            appoinment_status: 1,
                            patient_type: 1,
                            patientId:"$patient_details.patient_id",
                            patient_name: "$patient_details.patient_name",  // Adjust the patient details as per your patient collection
                            phone_number: "$patient_details.phone_number" ,
                            address:"$patient_details.address",
                            gender:"$patient_details.gender",
                            age:"$patient_details.age",
                            complaint:1,
                            advice:1,
                            diagnosi:1,
                            instruction:1,
                            medicins:1,
                            observation:1
                        }
                      }
                    
                ]).toArray();
                res.send(result);
            }catch (error) {
                console.error('Error fetching appointments:', error);
                res.status(500).send({ error: 'An error occurred while fetching appointments' });
            }
            
        })

        app.patch('/api/appoinments/:id', async (req, res) => {
            try {
                // Extract the appointment ID from the request parameters
                const { id } = req.params;
        
                // Extract the fields to update from the request body
                const updateData = req.body;
        
                // Validate the ID format
                if (!id || !ObjectId.isValid(id)) {
                    return res.status(400).send({ error: 'Invalid appointment ID' });
                }
        
                // Perform the update operation
                const result = await AppoinmentCollection.updateOne(
                    { _id: new ObjectId(id) }, // Filter by appointment ID
                    { $set: updateData } // Update only the provided fields
                );
        
                // Check if the document was updated
                if (result.matchedCount === 0) {
                    return res.status(404).send({ error: 'Appointment not found' });
                }
        
                // Return a success response
                res.send({ message: 'Appointment updated successfully', result });
            } catch (error) {
                console.error('Error updating appointment:', error);
                res.status(500).send({ error: 'An error occurred while updating the appointment' });
            }
        });

        //DrugData set post
        app.post('/api/drugs',async(req,res)=>{
            const drug_list = req.body
            const result = await DrugCollection.insertMany(drug_list)
            res.send(result)
        })

        //Drug searching
        app.get('/api/search-drugs', async (req, res) => {
            try {
                const { search } = req.query;
                // Validate if the search query is provided
                if (!search || search.trim() === "") {
                    return res.status(400).json({ error: "Search query is required" });
                }
        
                const fields = ["brand_name", "generic_name"];

                const query = {
                    $or: fields.map(field => ({
                        [field]: { $regex: `^${search.trim()}`, $options: "i" }
                    }))
                };
                // Search for drugs using regex
                const result = await DrugCollection.find(
                    query 
                )
                .limit(10)
                .toArray();
        
                // Send the results back as JSON
                res.json(result);
            } catch (error) {
                console.error('Error while searching drugs:', error);
                res.status(500).json({ error: 'An error occurred while searching drugs' });
            }
        });


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
