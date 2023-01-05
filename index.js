const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

// mongo
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kusbv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
     const presentStudentCollection = client
       .db("School-Management")
       .collection("presentStudent");
  try {
    //insert check in student
    app.post("/CheckinStudent", async (req, res) => {
      const studentInfo = req.body;
      const result = presentStudentCollection.insertOne(studentInfo);
      res.send(result);
    });
    //get present student
    app.get("/getPresentStudent", async (req, res) => {
      const query = {};
      const cursor = presentStudentCollection
        .find(query)
        .sort({ checkinTime: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });
    //Check out student
    app.delete("/CheckOut/:id", async (req, res) => {
      const id = req.params.id;
      const result = presentStudentCollection.deleteOne({ _id: ObjectId(id)});
      res.send(result);
    });
  } catch {}
}
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("api found");
});
app.listen(port, () => {
  console.log("server running");
});