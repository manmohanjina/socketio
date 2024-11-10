

const express = require('express');
const roomSchema = require('../model/roomSchema')
const CreateRoomRouter = express.Router();

CreateRoomRouter.post('/room', async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).send('Only admin can create rooms');
  }
  const { name } = req.body;
  try {
    const roomId = Math.random().toString(36).substring(7);
    const room = new roomSchema({ name, roomId });
    await room.save();
    res.status(201).send(`Room created with ID: ${roomId}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

CreateRoomRouter.post('/join', async (req, res) => {
  const { roomId } = req.body;

 
  try {
    const room = await roomSchema.findOne({ roomId });
    console.log(req.user);
    
    if (!room) {
      return res.status(404).send('Room not found');
    }
    room.users.push(req.user.userId);
    await room.save();
    res.send('Joined room');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = CreateRoomRouter;
