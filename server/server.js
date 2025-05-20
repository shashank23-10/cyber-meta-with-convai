import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Helpers to resolve file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, "../dist");

const app = express();

// Enable CORS for all origins on Express
app.use(
  cors({
    origin: "*", // Allow all origins
    credentials: true,
  })
);

// Serve Vite static build from ../dist
app.use(express.static(distPath));
// Fallback to index.html for SPA routes
app.get("/", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["my-custom-header"],
  },
  transports: ["websocket", "polling"],
});

// Initial state definition
let currentState = {
  "MetaLocation": "Internet",
  "Internet": {},
  "Ransomware": false,
  "IT-Network": {
    Compromised: false,
  },
  "OT-Network": {
    Compromised: false,
  },
  "Workstation": {
    USB: false,
    Compromised: false,
  },
  "Valves": {
    Valve1: true,
    Valve2: true,
    Tank1: 80,
    Tank2: 80,
  },
  "Pre-Heater": {
    Preheater: false,
    Distillation: false,
    Flare: false,
  },
};

// Socket connection handling
io.on("connection", socket => {
  console.log("Client connected:", socket.id);

  // Send initial state to the newly connected client
  socket.emit("json_data", currentState);
  console.log("Initial state sent to client:", socket.id);

  // Handle state updates from clients
  socket.on("json_data", data => {
    try {
      console.log(`State update received from client ${socket.id}:`, data);

      // Validate the data structure
      if (!data || typeof data !== "object") {
        throw new Error("Invalid state data received");
      }

      // Update the current state
      currentState = { ...data };
      console.log("State updated to:", currentState);

      // Broadcast to all clients (including sender)
      io.emit("json_data", currentState);
      console.log("State broadcasted to all clients");

      // Send acknowledgment to the sender
      socket.emit("ack", {
        status: "success",
        timestamp: Date.now(),
        message: "State updated successfully",
      });
    } catch (error) {
      console.error("Error processing state update:", error);
      socket.emit("ack", {
        status: "error",
        timestamp: Date.now(),
        message: error.message,
      });
    }
  });

  socket.on("error", error => {
    console.error("Socket error:", error);
  });

  // Handle disconnection
  socket.on("disconnect", reason => {
    console.log("Client disconnected:", socket.id, "Reason:", reason);
  });
});

const PORT = process.env.PORT || 8766;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`WebSocket server accepting connections`);
});
