const express = require('express');
const app = express();
const http = require('http');
const httpServer = http.createServer(app);
const { Server } = require('socket.io');

// CORS configuration for frontend access
const io = new Server(httpServer, {
  cors: {
    origin: "https://socketfrontend-432jyh7ks-manmohanjinas-projects.vercel.app/", // Frontend URL
    credentials: true,
  },
});

// Store connected users
let connectedUsers = [];

// Handle new socket connections
io.on('connection', (socket) => {
  console.log('Client connected success', socket.id);

  // Add new user to the list of connected users
  connectedUsers.push({ id: socket.id });
  io.emit('userConnected', connectedUsers); // Emit updated user list to all clients

  // Handle receiving a message from the client
  socket.on('privateMessage', (payload) => {
    const { message, targetUser } = payload;

    // Find the socket ID of the target user
    const targetSocket = connectedUsers.find(user => user.id === targetUser);

    // If the target user is found, send them the message
    if (targetSocket) {
      io.to(targetSocket.id).emit('message', {
        sender: socket.id, // Send sender's socket ID (or use username if you prefer)
        message: message,
      });
    }
  });

  // Listen for the 'connected' event (you can send any initialization data here)
  socket.on('connected', (msg) => {
    console.log(`User ${socket.id} connected with message:`, msg);
  });

  // Handle socket disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    // Remove the user from the connected users list
    connectedUsers = connectedUsers.filter(user => user.id !== socket.id);
    io.emit('userDisconnected', connectedUsers); // Emit updated user list to all clients
  });
});

// Start the server
httpServer.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});
