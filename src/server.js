"use strict";
/**
 * Module dependencies.
 */
const { Server } = require("socket.io");

/**
 * Load environment variables from .env file.
 */
const clientURLLocalhost = "http://localhost:3000";
// const clientUrlDeploy = "https://sphere-websockets-r3f-client.vercel.app";
const clientUrlDeploy = "https://vr-cat.vercel.app";


const port = 8080;

/**
 * Create a WebSocket server using Socket.IO.
 * Configured with CORS policy to allow connections from specified origins.
 */
const io = new Server({
  cors: {
    origin: [clientURLLocalhost, clientUrlDeploy],
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
   * Broadcast the transforms to other player.
   */
  socket.on("player-moving", (transforms) => {
    socket.broadcast.emit("player-moving", transforms);
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
