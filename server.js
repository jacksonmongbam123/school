require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const busboy = require('connect-busboy');
const path = require('path');

// Middlewares
app.use(busboy());
app.use(cors());
app.use(bodyParser.json());

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

// Database configuration
const configs = require('./config/config');
const constants = require("./utils/constants");

const PORT = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || (configs.MONGO_URI + "/" + constants.MONGO_DB_NAME);

console.log("Connecting to MongoDB database...");
mongoose
    .connect(mongoURI)
    .then(() => {
        console.log("MongoDB database connection established successfully!");
    })
    .catch(err => {
        console.error("MongoDB connection error:", err.message);
    });

// Vite full-stack middleware integration
async function setupFrontend() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Integrating Vite Dev Server middleware...");
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving production build from dist/...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Start Server
  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Fullstack Server running on http://localhost:${PORT}`);
  });

  // Socket Server
  const io = require("socket.io")(server);
  const socketEvents = require("./utils/socket_events");
  io.on(socketEvents.CONNECT, async (socket) => {
    require('./sockets/chatMessage')(io, socket);
  });
}

setupFrontend().catch(err => {
  console.error("Failed to setup frontend integration:", err);
});
