const ChatSchema = require('../../Model/ChatSchema');


const createChat = async (req, res) => {
    const { userName, roomId, userId, astrologerId, message } = req.body;
    console.log(userName, roomId, userId, astrologerId, message);

    // Validate request body
    if (!userId || !astrologerId || !roomId) {
        return res.status(400).json({ error: 'userId, astrologerId, and roomId are required' });
    }

    try {
        // Check if chat already exists
        let chat = await ChatSchema.findOne({ roomId });

        if (!chat) {
            // Create a new chat if it doesn't exist
            chat = new ChatSchema({
                userName: userName || 'Anonymous', // Default to 'Anonymous' if userName is not provided
                roomId,
                userId,
                astrologerId,
                messages: [], // Initialize messages as an empty array
            });
        }

        // If a message is provided, create a message object
        if (message && Object.keys(message).length > 0) {
            const newMessage = {
                from: message.from || userId, // Ensure a valid sender
                to: message.to || astrologerId, // Ensure a valid recipient
                message: message.message, // The actual message content
                timestamp: new Date(), // Current timestamp
            };

            // Add the new message to the chat
            chat.messages.push(newMessage);
        }

        await chat.save(); // Save the chat

        // Send a success response
        return res.status(201).json({ message: 'Chat created successfully', chat });
    } catch (error) {
        console.error('Error creating chat:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getAllChats = async (req, res) => {
    try {
        const Chats = await ChatSchema.find();
        res.status(200).json(Chats);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server error' });
    }
}

const getAstroChats = async (req, res) => {
    try {
        const { astrologerId } = req.body;
        console.log(astrologerId);
        const AstroChats = await ChatSchema.find({ astrologerId: astrologerId });
        if (!AstroChats) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        res.status(200).json(AstroChats);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server error' });
    }
}

const getAstroChatBasisOfRoomId = async (req, res) => {
    try {
        const { roomId } = req.body;
        console.log(astrologerId);
        const AstroChats = await ChatSchema.find({ roomId: roomId });
        if (!AstroChats) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        res.status(200).json(AstroChats);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server error' });
    }
}

module.exports = { getAllChats, getAstroChats,createChat ,getAstroChatBasisOfRoomId};