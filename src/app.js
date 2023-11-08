  require("dotenv").config();

  const port = process.env.PORT;
  const host = process.env.HOST;
  const serverName = process.env.SERVER_NAME;
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;

  const mongoose = require("mongoose");
  const express = require("express");
  const cors = require("cors");
  const {verifyToken} = require("./router/auth");
  const userRouter = require("./router/userRouter");
  const patientRouter = require("./router/patientRouter");
  

  let uriString = `mongodb+srv://${username}:${password}@patientsdata.vrs9kh1.mongodb.net/?retryWrites=true&w=majority`;

  const app = express();
  app.use(cors());
  app.use(express.json());

  // Connect to MongoDB Atlas
  mongoose
    .connect(uriString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

  app.use("/users", userRouter);
  app.use("/patients", verifyToken, patientRouter);

  // Listen on port 3000
  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
