import {Server as SocketIOServer} from "socket.io"
import Message from "./models/MessagesModel.js";
import Channel from "./models/ChannelModel.js";

import fs from 'fs';
const questionResponseMap = JSON.parse(fs.readFileSync('./chatting.json', 'utf-8'));

const setupSocket = (server) =>{
   const io = new SocketIOServer(server, {
    cors:{
        origin: process.env.ORIGIN,
        methods:["GET","POST"],
        credentials:true,
    },
   });

   const userSocketMap = new Map();

   const disconnect = (socket) =>{
    console.log(`Client Disconnected: ${socket.id}`);
    for(const [userId,socketId] of userSocketMap.entries()){
        if(socketId === socket.id){
            userSocketMap.delete(userId);
            break;
        }
    }
   };

//    const sendMessage = async(message)=>{
//     const senderSocketId = userSocketMap.get(message.sender);
//     const recipientSocketId = userSocketMap.get(message.recipient);

//     const createdMessage = await Message.create(message);

//     const messageData = await Message.findById(createdMessage._id)
//     .populate("sender", "id email firstName lastName image color")
//     .populate("recipient", "id email firstName lastName image color")

//     if(recipientSocketId){
//         io.to(recipientSocketId).emit("receiveMessage",messageData);
//     }
//     if(senderSocketId){
//         io.to(senderSocketId).emit("receiveMessage",messageData);
//     }

//    };


const sendMessage = async (message) => {
    // Get sender and recipient socket IDs
    const senderSocketId = userSocketMap.get(message.sender);
    const recipientSocketId = userSocketMap.get(message.recipient);

    // Create the original message in the database
    const createdMessage = await Message.create(message);

    // Populate the message with sender and recipient details
    const messageData = await Message.findById(createdMessage._id)
        .populate("sender", "id email firstName lastName image color")
        .populate("recipient", "id email firstName lastName image color");

    // Check if there's a predefined response for the sent message in questionResponseMap
    let responseContent = null;
    // if (message.messageType === 'text') {
    //     responseContent = questionResponseMap[message.content.toLowerCase()];
    // }
    if (message.messageType === 'text' && message.recipient.toString() === '6744d19a0ba897d83bf87d62') {
        responseContent = questionResponseMap[message.content.toLowerCase()];
    }
console.log(responseContent);
    if (responseContent) {
        // Create a response message from the recipient to the sender
        const responseMessage = {
            sender: message.recipient,  // The recipient is now the sender of the response
            recipient: message.sender,  // The sender is now the recipient
            content: responseContent,   // The mapped response
            timestamp: new Date(),
            messageType: "text",
            fileUrl: null
        };

        // Save the response message to the database
        const createdResponse = await Message.create(responseMessage);

        // Populate the response message with sender and recipient details
        const responseMessageData = await Message.findById(createdResponse._id)
            .populate("sender", "id email firstName lastName image color")
            .populate("recipient", "id email firstName lastName image color");

        // Emit the response message to the sender (the original message's sender)
        if (senderSocketId) {
            io.to(senderSocketId).emit("receiveMessage", responseMessageData);
        }
    }
    if(!responseContent&&message.recipient.toString() === '6744d19a0ba897d83bf87d62'){
        const responseMessage = {
            sender: message.recipient,  // The recipient is now the sender of the response
            recipient: message.sender,  // The sender is now the recipient
            content: "I will connect you with our support agent in a few minutes or just give us a mail at help@chatify.com",   // The mapped response
            timestamp: new Date(),
            messageType: "text",
            fileUrl: null
        };

        // Save the response message to the database
        const createdResponse = await Message.create(responseMessage);

        // Populate the response message with sender and recipient details
        const responseMessageData = await Message.findById(createdResponse._id)
            .populate("sender", "id email firstName lastName image color")
            .populate("recipient", "id email firstName lastName image color");

        // Emit the response message to the sender (the original message's sender)
        if (senderSocketId) {
            io.to(senderSocketId).emit("receiveMessage", responseMessageData);
        }
    }
    // Emit the original message to the recipient and sender
    if (recipientSocketId) {
        io.to(recipientSocketId).emit("receiveMessage", messageData);
    }
    if (senderSocketId) {
        io.to(senderSocketId).emit("receiveMessage", messageData);
    }
};

   const sendChannelMessage = async(message) =>{
    const {channelId,sender,content,messageType,fileUrl} = message;
    const createdMessage = await Message.create({
        sender,
        recipient:null,
        content,
        messageType,
        timestamp:new Date(),
        fileUrl,
    });

    const messageData = await Message.findById(createdMessage._id)
    .populate("sender","id email firstName lastName image color")
    .exec();

    await Channel.findByIdAndUpdate(channelId,{
        $push: { messages: createdMessage._id},
    });
    

    const channel = await Channel.findById(channelId).populate("members");

    const finalData = {...messageData._doc, channelId: channel._id };

    if(channel && channel.members){
    channel.members.forEach((member)=>{
        const memberSocketId = userSocketMap.get(member._id.toString());
        if(memberSocketId){
            io.to(memberSocketId).emit("receive-channel-message",finalData);
        }
    });
        const adminSocketId = userSocketMap.get(channel.admin._id.toString());
        if(adminSocketId){
            io.to(adminSocketId).emit("receive-channel-message",finalData);
        }
    }
   }

   io.on("connection", (socket)=>{
    const userId = socket.handshake.query.userId;

    if(userId){
        userSocketMap.set(userId,socket.id);
        console.log(`User Connected: ${userId} with Socket ID: ${socket.id}`)
    }else {
        console.log("User ID not provided during connection");
    }

    socket.on("sendMessage",sendMessage);
    socket.on("send-channel-message",sendChannelMessage);
    socket.on("disconnect", ()=> disconnect(socket));

   });
}

export default setupSocket;