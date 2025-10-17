const express = require("express");

require("dotenv").config();
const cors = require("cors");


const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  console.log("User data received:", name, email, password);
  res.send("Registration successful!");
});
app.get("/", (req, res) => {
  res.send("Server is working ✅");
});

app.use("/api/auth", authRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
