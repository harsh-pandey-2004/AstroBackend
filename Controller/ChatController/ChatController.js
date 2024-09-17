const ChatSchema =require('../../Model/ChatSchema');

const getAllChats=async (req,res)=>{
    try {
        const Chats=await ChatSchema.find();
        res.status(200).json(Chats);
    } catch (error) {
        res.status(500).json({message:'Internal Server error'});
    }
}

const getAstroChats=async (req,res)=>{
    try {
        const {astrologerId}=req.body;
        const AstroChats=await ChatSchema.find({astrologerId:astrologerId});
        if (!AstroChats) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        res.status(200).json(AstroChats);
    } catch (error) {
        res.status(500).json({message:'Internal Server error'});
    }
}

module.exports={getAllChats,getAstroChats};