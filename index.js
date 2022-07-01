const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q3ruk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const taskCollection = client.db("TaskManager").collection("AllTask");
    // alTask get api
    app.get("/allTask", async (req, res) => {
      const query = {};
      const task = await taskCollection.find(query).toArray();
      res.send(task);
    });
    // task post api
    app.post("/task", async (req, res) => {
      const addTask = req.body;
      const task = await taskCollection.insertOne(addTask);
      res.send(task);
    });
    // checked task  api
    app.patch("/task/:id", async (req, res) => {
      const id = req.params.id;
      const taskBody = req.body;
      const filter = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: {
          check: taskBody.check,
        },
      };
      const result = await taskCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    // edit task api
    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const updateTask = req.body;
      console.log(id, updateTask);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          text: updateTask.text,
        },
      };
      const result = await taskCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });
  } finally {
    //some thing
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Task Manager Server Running");
});
app.listen(port, () => {
  console.log(port, "Port Running");
});
