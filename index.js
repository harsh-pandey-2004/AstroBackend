const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios"); 
const cors = require("cors");
const path = require("path");
const server = express();
const PORT = 3000;
const apiKey = "AIzaSyBvnHKYalPScRMFLmx-vUsfdLwkRxAyjyw"; // Use environment variable for API key
const http=require ('http');
const socketIo=require('socket.io');
const Chat=require('./Model/ChatSchema')


const httpServer=http.createServer(server);

const io=socketIo(httpServer,{
  cors:{
    origin:"*",
    methods:["GET","POST"],
  }
});

let astrologers = {};              //  store connected astrologers
let pendingRequests = {};         //  store pending chat requests
let activeChats = {};            //  store active chat connections

server.use(cors());
server.use(express.json());
server.use('/astrologer-pics', express.static(path.join(__dirname, 'Astrologer_Profile_Pic')));
server.use('/astrocounselor-pics', express.static(path.join(__dirname, 'Astrocounselor_Profile_Pic')));



// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://astrocaptain0612:astrocaptain0612@cluster0.ompgjjy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};
connectDB();



// Google Places endpoint
server.get("/places", async (req, res) => {
  const { input } = req.query;
  console.log("Input received:", input);

  if (!input) {
    return res.status(400).send({ error: "Input is required" });
  }

  const endpoint = `https://maps.googleapis.com/maps/api/place/autocomplete/json`;

  try {
    const response = await axios.get(endpoint, {
      params: {
        input,
        types: "(cities)",
        key: apiKey,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching suggestions:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send({ error: "Error fetching suggestions" });
  }
});

// Socket code
const usp = io.of('/user-namespace');
usp.on('connection',(socket)=>{
  console.log('A client connected:', socket.id);
  
  socket.on('join',(data)=>{
    if(data.type=='astrologer'){
      astrologers[data.astrologerId]=socket.id;
      console.log(`Astrologer connected: ${data.astrologerId}, Socket ID: ${socket.id}`);
    }
    else {
      console.log(`User connected:${data.userId} Socket ID: ${socket.id}`);
    }
  })

  socket.on('userMessage',async(data)=>{
    console.log(data,"94");
    const { userId, astrologerId, message,userName } = data;
    try{
      const acceptedRequest = await MessageRequest.findOne({
        
        userId,
        astrologerId,
        status: 'accepted'
      });
      if (acceptedRequest) {
        const chat = await Chat.findOne({ roomId: acceptedRequest.roomId });
        console.log("109",acceptedRequest.roomId);
        if (chat) {
          socket.join(acceptedRequest.roomId);
          const astrologerSocketId = astrologers[astrologerId];
          console.log(astrologerSocketId);
          if (astrologerSocketId) {
          const astrologerSocket = usp.sockets.get(astrologerSocketId);
          if (astrologerSocket) {
            astrologerSocket.join(acceptedRequest.roomId);
          }
        }
          // Emit the message to the room
          usp.to(acceptedRequest.roomId).emit('message', {
            from: userId,
            message
          });
          // chat.messages.push({
          //   from: userId,
          //   to: astrologerId,
          //   message,
          //   timestamp: new Date()
          // });
          const newMessage = {
            from: userId,
            to: astrologerId,
            message
          };
          
          // Check if the new message is valid
          if (!newMessage.to || !newMessage.from) {
            console.error('Invalid message:', newMessage);
            return;
          }
          const invalidMessages = chat.messages.filter(msg => !msg.to);
          if (invalidMessages.length > 0) {
            console.error('Found invalid messages:', invalidMessages);
            // Optionally: Fix the invalid messages by setting the `to` field, or remove them
          }
          
          chat.messages.push(newMessage);
          console.log("Message to:", newMessage);
          await chat.save();
  
          console.log(`Message sent directly to chat room: ${acceptedRequest.roomId}`);
        } else {
          console.error('Chat not found for the accepted request.');
          socket.emit('error', 'Chat not found.');
        }
      }
      else{
        const astrologerSocketId=astrologers[data.astrologerId];
        if (astrologerSocketId) {
          pendingRequests[userId] = { ...data, socketId: socket.id };
  
          // Save the new message request
          const messageRequest = new MessageRequest({
            userName,
            userId,
            astrologerId,
            message,
            status: 'pending'
          });
  
          await messageRequest.save();
  
          usp.to(astrologerSocketId).emit('chatRequest', {
            userId,
            socketId: socket.id,
            message,
            userName: data.userName
          });
  
          console.log(`User ${socket.id} sent a message request: "${message}" to Astrologer ${astrologerId}`);
        } else {
          socket.emit('error', 'Astrologer not available');
        }
      }
    }
    catch (error) {
    console.error('Error handling user message:', error);
    socket.emit('error', 'Error processing your message.');
  }
  })
    
  socket.on('acceptChat', async (userId,callback) => {
    const privateroom_of_Id = `${userId.userId}-${userId.astrologerId}`;
    const userID = userId.userId;
  
    try {
      let chat = await Chat.findOne({ roomId: privateroom_of_Id });

        if (!chat) {
            // Retrieve the message request to get the initial message
            const messageRequest = await MessageRequest.findOne({
                userId: userId.userId,
                astrologerId: userId.astrologerId,
                status: 'pending'
            });

            if (!messageRequest) {
                throw new Error('Message request not found');
            }

            // Create a new chat with the initial message
            chat = new Chat({
              userName:userId.userName,
                userId: userId.userId,
                astrologerId: userId.astrologerId,
                roomId: privateroom_of_Id,
                messages: [{
                    from: messageRequest.userId, 
                    to: messageRequest.astrologerId, 
                    message: messageRequest.message,
                    timestamp: messageRequest.createdAt 
                }]
            });

            await chat.save();
        }
  
      // Update the message request status
      await MessageRequest.updateOne(
        { userId: userId.userId, astrologerId: userId.astrologerId },
        { status: 'accepted',
          roomId:privateroom_of_Id
        }
      );
  
      if (pendingRequests[userID] && pendingRequests[userID].socketId) {
        const userSocketId = pendingRequests[userID].socketId;
  
        if (usp.sockets && usp.sockets.get) {
          const userSocket = usp.sockets.get(userSocketId);
          if (userSocket) {
            // Join the user and astrologer into the room
            socket.join(privateroom_of_Id);
            userSocket.join(privateroom_of_Id);
  
            // Notify the user that the chat has been accepted
            usp.to(userSocketId).emit('chatAccepted');
            usp.to(userSocketId).emit('message', {
              from: 'Astrologer',
              message: 'Chat Accepted'
            });
  
            // Log the room creation
            console.log(`User and Astrologer joined room: ${privateroom_of_Id}`);
            delete pendingRequests[userID].socketId;
            callback({ status: 'success', message: 'Chat accepted successfully.' });
          } else {
            console.error(`User socket with ID ${userSocketId} not found.`);
            socket.emit('error', 'User disconnected or invalid socket.');
          }
        } else {
          console.error(`usp.sockets is undefined or invalid.`);
        }
      } else {
        console.error(`Invalid or missing pending request for userID: ${userID}`);
        socket.emit('error', 'Invalid request or user not found.');
      }
    } catch (error) {
      console.error('Error during chat acceptance process:', error);
      socket.emit('error', 'Chat acceptance failed.');
    }
  });
  //astrologer decline request
  socket.on('declineChat',(userId)=>{
    if (pendingRequests[userId]) {
      io.to(userId).emit('chatDeclined');
      console.log(`Astrologer ${socket.id} declined the chat request from User ${userId}`);
      delete pendingRequests[userId];
    }
  })

  
  socket.on('sendMessage', async(data) => {

    console.log(data, "147");
  
    const {from, message, to,roomId } = data;
    try {
      const newMessage = {
        from, 
        to, 
        message, 
        timestamp: new Date()
      };
      const chat = await Chat.findOneAndUpdate(
        // { userId: from, astrologerId: to },
        {roomId:data.roomId},
        { $push: { messages: newMessage } },
        { new: true, upsert: true } // Creates new chat if it doesn't exist
      );
      // const chat = await Chat.findOne({ userId: from, astrologerId: to }) || await Chat.findOne({ userId: to, astrologerId: from });
  
      if (!chat) {
        console.error('Chat not found');
        return;
      }
  
      chat.messages.push({ from, to, message });
      await chat.save();
    }
      catch (error) {
        console.error('Error saving message:', error);
      }
  
    if (roomId) {
      console.log(`Sending message to room: ${roomId}`);
  
      
      usp.to(roomId).emit('message', {
        from,      
        message,   
      });
  
      console.log(`${from} sent a message: "${message}" to room ${roomId}`);
    } else {
      socket.emit('error', 'Invalid room.');
      console.log("Invalid room");
    }
  });

  socket.on('existChat',async function(data){
    console.log(data,"317");
    var chats=await Chat.find({ roomId: data.roomId });
    if (chats.length > 0) {
      
      let messages = chats[0].messages; 
      socket.emit('loadChats', { chats: messages });
  } else {
      console.log('No chats found');
  }
})

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
    delete astrologers[socket.id];
    delete pendingRequests[socket.id];
    delete activeChats[socket.id];
});
})

// Import routes
const poojaDetailsRoutes = require("./Routes/PoojaDetailsRoutes");
const userRoutes = require("./Routes/UserRoutes");
const AstrologerRoutes = require("./Routes/AstrologerRoutes");
const panditRoutes = require("./Routes/Pandit_Routes");
const AstroCoucellor = require("./Routes/AstroloCouncellorController");
const VastuRoutes = require("./Routes/VastuRoutes");
const VastuBookRoutes = require("./Routes/VastuBookRoute");
const MessageRequest = require("./Model/MessageRequest");;
const astroThingsRoutes = require("./Routes/AstroItemsRoutes");
const TempleDetails = require("./Routes/TempleRoutes");
server.use("/api", userRoutes);
server.use("/api", AstroCoucellor);
server.use("/api", poojaDetailsRoutes);
server.use("/api", AstrologerRoutes);
server.use("/api", panditRoutes);
server.use("/api", VastuRoutes);
server.use("/api", VastuBookRoutes);
server.use("/api", astroThingsRoutes);
server.use('/api',TempleDetails)

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
