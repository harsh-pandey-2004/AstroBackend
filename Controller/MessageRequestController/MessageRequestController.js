const MessageRequest=require('../../Model/MessageRequest');
const ChatSchema=require('../../Model/ChatSchema');
const newMessageRequest=async (req,res)=>{
    try {
        const { astrologerId, message, userId, userName,status} = req.body;
        // console.log(userName, userId, astrologerId, message,status)
        const allowedStatuses = ['pending', 'accepted', 'declined'];
        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value. Allowed values are: pending, accepted, declined.',
            });
        }

        const existingRequest = await MessageRequest.findOne({
            userId,
            astrologerId,
            status: 'pending' 
        });

        if (existingRequest) {
            return res.status(409).json({
                success: false,
                message: 'A message request already exists for this user and astrologer.',
            });
        }
        const newMessageRequest = new MessageRequest({
            userName,
            userId,
            astrologerId,
            message,
            roomId:`${userId}-${astrologerId}`,
            status: status || 'pending',
        });
        const savedMessageRequest = await newMessageRequest.save();
        res.status(201).json({
            success: true,
            data: savedMessageRequest,
        });
    } catch (error) {
        console.error('Error creating message request:', error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

const statusUpdate=async(req,res)=>{
    try {
        const { messageId } = req.body; 
        const updatedMessageRequest = await MessageRequest.findByIdAndUpdate(
            messageId,
            { status: 'accepted' },
            
            { new: true, runValidators: true } 
        );
        if (!updatedMessageRequest) {
            return res.status(404).json({
                success: false,
                message: 'Message request not found.',
            });
        }


        const chatExists = await ChatSchema.findOne({ roomId: updatedMessageRequest.roomId });

        if (!chatExists) {
            
            const newChat = new ChatSchema({
                userName:updatedMessageRequest.userName,
                userId:updatedMessageRequest.userId,
                astrologerId:updatedMessageRequest.astrologerId,
                roomId: updatedMessageRequest.roomId,
                messages: [{from:updatedMessageRequest.userId,to:updatedMessageRequest.astrologerId,message:updatedMessageRequest.message}]
                
            });
            await newChat.save();
        } else {
            
            console.log('Chat already exists, not pushing messageRequest.');
        }
        res.status(200).json({
            success: true,
            data: updatedMessageRequest,
        });

    } catch (error) {
        console.error('Error updating message request status:', error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

const getAllMessageRequests=async (req,res)=>{
    try {
        const Chats=await MessageRequest.find();
        res.status(200).json(Chats);
    } catch (error) {
        res.status(500).json({message:'Internal Server error'});
    }
}

const getMessageRequestOnTheBasisOfStatus=async (req,res)=>{
    try {
        const Chats=await MessageRequest.find({status:'pending'});
        res.status(200).json(Chats);
    } catch (error) {
        res.status(500).json({message:'Internal Server error'});
    }
}

// const getMessageRequestOnTheBasisOfAcceptedStatus=async (req,res)=>{
//     try {
//         const Chats=await MessageRequest.find({status:'accepted'});
//         res.status(200).json(Chats);
//     } catch (error) {
//         res.status(500).json({message:'Internal Server error'});
//     }
// }

module.exports={getAllMessageRequests,getMessageRequestOnTheBasisOfStatus,newMessageRequest,statusUpdate};
