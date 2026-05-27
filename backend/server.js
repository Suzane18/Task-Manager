require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db.js");


const authRoutes = require("./routes/authroutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const reportRoutes = require("./routes/reportRoutes");


const app = express();

//middleware to handle cors
app.use(
    cors({
        origin:process.env.CLIENT_URL ||"*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);


//connect to database
// Log a masked MONGO_URI for diagnosis (never print credentials)
const rawMongoUri = process.env.MONGO_URI || '';
const maskedMongoUri = rawMongoUri.replace(/(\/\/)(.*?)(@)/, '$1***$3');
console.log('MONGO_URI (masked):', maskedMongoUri);
connectDB();

//middleware
app.use(express.json());

//routes
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/tasks",taskRoutes);
app.use("/api/reports",reportRoutes);

//Server upload folders
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});