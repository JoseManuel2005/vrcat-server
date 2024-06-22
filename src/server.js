"use strict";

/**
 * Module dependencies.
 */
const { Server } = require("socket.io");

/**
 * Load environment variables from .env file.
 */
const clientURLLocalhost = "http://localhost:3000";
const clientUrlDeploy = "https://vr-cat.vercel.app";

const port = 8080;

/**
 * Create a WebSocket server using Socket.IO.
 * Configured with CORS policy to allow connections from specified origins.
 */
const io = new Server({
  cors: {
    origin: [clientURLLocalhost, clientUrlDeploy],
    methods: ["GET", "POST"],
    credentials: true
  },
});

/**
 * Start listening on the specified port.
 */
io.listen(port);

/**
 * Listen for incoming connections.
 */
io.on("connection", (socket) => {
  /**
   * Log the ID of the player connected.
   */
  console.log(
    "Player joined with ID",
    socket.id,
    ". There are " + io.engine.clientsCount + " players connected."
  );

  /**
   * Handle a player's movement.
   * Broadcast the transforms to other players.
   * Log the player's ID and position.
   */
  socket.on("player-moving", (transforms) => {
    console.log(`Player with ID ${socket.id} is moving. Position:`, transforms.position);
    socket.broadcast.emit("player-moving", {
      id: socket.id,
      ...transforms,
    });
  });

  /**
   * Handle player disconnection.
   */
  socket.on("disconnect", () => {
    console.log(
      "Player disconnected with ID",
      socket.id,
      ". There are " + io.engine.clientsCount + " players connected"
    );
  });
});
