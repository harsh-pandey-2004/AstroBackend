const MessageRequest=require('../../Model/MessageRequest');

const getAllMessageRequests=async (req,res)=>{
    try {
        const Chats=await MessageRequest.find();
        res.status(200).json(Chats);
    } catch (error) {
        res.status(500).json({message:'Internal Server error'});
    }
}

module.exports={getAllMessageRequests};