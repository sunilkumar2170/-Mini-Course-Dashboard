
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passport");
const sequelize = require("./config/db");
const authRoutes = require("./routes/auth");
const User = require("./models/User");
const postRoutes = require("./routes/postRoutes");


const app = express();


app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());


app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // true if using HTTPS
  })
);


app.use(passport.initialize());
app.use(passport.session());


app.get("/", (req, res) => {
  res.send("✅ Server is working fine!");
});
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);


sequelize
  .sync({ alter: true })
  .then(() => console.log("✅ Database synced successfully"))
  .catch((err) => console.error("❌ Error syncing DB:", err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
