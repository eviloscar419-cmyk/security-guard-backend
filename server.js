const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const toolsRoutes = require("./routes/toolsRoutes");
const chatRoutes = require("./routes/chatRoutes");


dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;


// =======================
// Middleware
// =======================

app.use(
    cors({
        origin: "*",
        methods: ["GET","POST","PUT","DELETE"],
        credentials: true
    })
);

app.use(helmet());

app.use(express.json());

app.use(express.urlencoded({
    extended:true
}));

app.use(morgan("dev"));


// =======================
// MongoDB Connection
// =======================

connectDB();


// =======================
// Frontend Hosting
// =======================

app.use(
    express.static(
        path.join(__dirname,"../frontend")
    )
);


// =======================
// API Routes
// =======================

app.use("/api/auth",authRoutes);

app.use("/api/admin",adminRoutes);

app.use("/api/user",userRoutes);

app.use("/api/tools",toolsRoutes);

app.use("/api/chat",chatRoutes);


// =======================
// Health Check
// =======================

app.get("/api/status",(req,res)=>{

    res.json({
        success:true,
        message:"Security Guard API Running",
        time:new Date()
    });

});


// =======================
// Frontend fallback
// =======================

app.get("*",(req,res)=>{

    res.sendFile(
        path.join(
            __dirname,
            "../frontend/index.html"
        )
    );

});


// =======================
// Start Server
// =======================

app.listen(PORT,()=>{

    console.log(
        `🚀 Security Guard running on port ${PORT}`
    );

});
