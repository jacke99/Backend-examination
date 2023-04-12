import express from "express";
import { fetchCollection } from "../mongo/mongoClient.js";
import jwtUtil from "../util/jwtUtil.js";
import jwtFilter from "../filter/jwtFilter.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
dotenv.config();

const router = express.Router();

//Create account
router.post("/create/account/", async (req, res) => {
  let user = req.body;
  user.role = "USER";

  const hash = bcrypt.hashSync(user.password, parseInt(process.env.saltRounds));
  user.password = hash;

  const result = await fetchCollection("users").updateOne(
    { username: user.username },
    { $setOnInsert: user },
    { upsert: true }
  );

  if (result.matchedCount != 0) {
    res.status(400).send("Username is already taken");
  } else {
    res.status(201).send("Account created");
  }
});

//Log in
router.put("/login/", async (req, res) => {
  let login = req.body;

  if (login.username == "" || login.username == null) {
    res.status(400).send("Bad Request");
  } else {
    const user = await fetchCollection("users").findOne({
      username: login.username,
    });

    const passwordMatch = bcrypt.compareSync(login.password, user.password); // true

    if (!passwordMatch) {
      res.status(400).send({ message: "Password missing" });
    } else {
      if (user != null) {
        const token = jwtUtil.generate(user);
        console.log(token);
        res.send(token);
      } else {
        console.log("User not found in db");
        res.sendStatus(400);
      }
    }
  }
});

//Create new channel
router.put("/channel/", jwtFilter.authorize, async (req, res) => {
  const channel = req.body;
  const decoded = jwtUtil.getUser(req);
  channel.createdBy = decoded.username;
  channel.messages = [];

  if (channel.title == null || channel.title == "") {
    res.status(400).send({ error: "Missing channel titel" });
  } else {
    const newChannel = await fetchCollection("channels").updateOne(
      { title: channel.title },
      { $setOnInsert: channel },
      { upsert: true }
    );
    await fetch("http://127.0.0.1:4000/channel/");
    res.status(201).send(newChannel);
  }
});

//Get all channels
router.get("/channel/", async (req, res) => {
  try {
    const allChannels = await fetchCollection("channels").find().toArray();
    res.send(allChannels);
  } catch (err) {
    console.log(req.ip, err.serverMessage);

    res.status(500);
    res.send(err.clientMessage);
  }
});

//Get a specific channel
router.get("/channel/:id", jwtFilter.authorize, async (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    const channel = await fetchCollection("channels").findOne({
      _id: new ObjectId(req.params.id),
    });
    console.log(channel);
    if (channel == null) {
      res.status(404).send({ error: "Could not fetch the document" });
    } else {
      res.status(200).json(channel);
    }
  } else {
    res.status(404).send({ error: "Could not fetch the document" });
  }
});

//Send message to specific channel
router.post("/channel/:id", jwtFilter.authorize, async (req, res) => {
  const decoded = jwtUtil.getUser(req);
  const roomId = req.body.roomId;
  const message = req.body.message;
  const newMessage = {
    from: decoded.username,
    message: message,
  };

  const channel = await fetchCollection("channels").updateOne(
    { _id: new ObjectId(req.params.id) },
    { $push: { messages: newMessage } }
  );
  console.log(channel);
  if (channel.matchedCount == 0) {
    res.status(404).send({ message: "Could not find the channel" });
  } else {
    await fetch(`http://127.0.0.1:4000/message/?roomId=${roomId}`);
    res.status(201).send(channel);
  }
});

//Delete specified channel
router.delete("/channel/:id", jwtFilter.authorize, async (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    const channel = await fetchCollection("channels").deleteOne({
      _id: new ObjectId(req.params.id),
    });
    console.log(channel);
    if (channel.deletedCount == 0) {
      res
        .status(404)
        .send({ error: "Could not find the document you want to delete" });
    } else {
      await fetch("http://127.0.0.1:4000/channel/");
      res.status(200).send("Deleted the channel");
    }
  } else {
    res
      .status(404)
      .send({ error: "Could not find the document you want to delete" });
  }
});

//Post a broadcast (only for admin)
router.post("/broadcast/", jwtFilter.authorizeAdmin, async (req, res) => {
  const broadcast = req.body;
  const decoded = jwtUtil.getUser(req);
  broadcast.createdBy = decoded.username;
  let time = new Date().toLocaleTimeString("sv-SE");
  let date = new Date().toLocaleDateString("sv-SE");
  broadcast.uploadedAt = `Date: ${date} at: ${time}`;

  if (broadcast.title == null || broadcast.title == "") {
    res.status(400).send({ error: "Missing broadcast titel" });
  } else if (broadcast.message == null || broadcast.message == "") {
    res.status(400).send({ error: "Missing broadcast message" });
  } else {
    const newBroadcast = await fetchCollection("broadcasts").insertOne(
      broadcast
    );
    await fetch("http://127.0.0.1:4000/broadcast/");
    res.status(201).send(newBroadcast);
  }
});

//Get all broadcasts
router.get("/broadcast/", async (req, res) => {
  try {
    const allBroadcasts = await fetchCollection("broadcasts").find().toArray();
    res.send(allBroadcasts);
  } catch (err) {
    console.log(req.ip, err.serverMessage);

    res.status(500).send(err.clientMessage);
  }
});

export default router;
