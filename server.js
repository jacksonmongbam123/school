require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const busboy = require('connect-busboy');
const path = require('path');

// Middlewares
app.use(busboy());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serving static public directory if present
app.use(express.static(path.join(__dirname, 'public')));

// Import Routes
const loginRoute = require("./routes/login_route");
const classRoutes = require("./routes/class_management_routes");
const homeworkRoutes = require("./routes/homework_routes");
const timetableRoutes = require("./routes/timetable_routes");
const dfRoutes = require("./routes/df/df_routes");
const mRoutes = require("./routes/m/m_routes");
const relRoutes = require("./routes/rel/rel_routes");

// Bind Routes
app.use("/login", loginRoute);
app.use("/class", classRoutes);
app.use("/homework", homeworkRoutes);
app.use("/timetable", timetableRoutes);
app.use("/df", dfRoutes);
app.use("/m", mRoutes);
app.use("/rel", relRoutes);
app.use("/rel_teacher_qualifications", require("./routes/rel/teacher_qualification_routes"));

// Database configuration
const configs = require('./config/config');
const constants = require("./utils/constants");
const PORT = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || (configs.MONGO_URI + "/" + constants.MONGO_DB_NAME);

console.log("Connecting to MongoDB database...");
mongoose.set("bufferCommands", false); // Prevents database queries from buffering/hanging if connection is offline
mongoose
    .connect(mongoURI)
    .then(() => {
        console.log("MongoDB database connection established successfully!");
    })
    .catch(err => {
        console.error("MongoDB connection error:", err.message);
    });

// API health and status check endpoint
app.get("/", (req, res) => {
    res.json({
        status: "ok",
        message: "School Portal Backend Service is running.",
        uptime: process.uptime()
    });
});

// Database offline graceful recovery middleware
app.use((err, req, res, next) => {
    if (err && (err.name === 'MongooseError' || err.name === 'MongoNetworkError' || err.message?.includes('buffering timed out'))) {
        console.warn('[AI Studio] Database offline — returning mock empty response');
        if (req.method === 'GET') {
            return res.json(req.path.endsWith('s') || req.path.endsWith('s/') ? [] : {});
        }
        return res.status(503).json({ error: 'Service temporarily unavailable (database offline)' });
    }
    next(err);
});

// Start Server
const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend Server running on http://localhost:${PORT}`);
});

// Socket Server
const io = require("socket.io")(server);
const socketEvents = require("./utils/socket_events");
io.on(socketEvents.CONNECT, async (socket) => {
    try {
        require('./sockets/chatMessage')(io, socket);
    } catch (socketErr) {
        console.error("Socket chatMessage init error:", socketErr);
    }
});
