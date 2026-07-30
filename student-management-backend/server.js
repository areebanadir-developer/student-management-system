const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

app.use(cors());
app.use(express.json());

const client = new MongoClient("mongodb://127.0.0.1:27017");

let students;

client.connect().then(() => {
  students = client
    .db("studentManagementDB")
    .collection("students");

  console.log("MongoDB Connected");
});

// CREATE STUDENT
app.post("/students", async (req, res) => {
  const { name, rollNo, department, semester, cgpa } = req.body;
  if (!name || !rollNo || !department || !semester || !cgpa) {
    return res.status(400).json({
      success: false,
      message: "Please fill all fields"
    });
  }
  const result = await students.insertOne(req.body);
  res.status(201).json({
    success: true,
    message: "Student Added Successfully",
    result
  });
});

// GET STUDENTS
app.get("/students", async (req, res) => {
  const data = await students.find().toArray();
  res.json(data);
});

// UPDATE STUDENT
app.put("/students/:id", async (req, res) => {

  const { name, rollNo, department, semester, cgpa } = req.body;

  if (!name || !rollNo || !department || !semester || !cgpa) {
    return res.status(400).json({
      success: false,
      message: "Please fill all fields"
    });
  }

  await students.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: req.body }
  );

  res.json({
    success: true,
    message: "Student Updated Successfully"
  });

});

// DELETE STUDENT
app.delete("/students/:id", async (req, res) => {
  await students.deleteOne({
    _id: new ObjectId(req.params.id)
  });

  res.json({
    success: true,
    message: "Student Deleted Successfully"
  });
});

app.listen(5001, () => {
  console.log("Server running on port 5001");
});