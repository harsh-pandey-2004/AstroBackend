const mongoose=require('mongoose');

const MessageReuestSchema=new mongoose.Schema({
      userId:{
            type:mongoose.Schema.ObjectId,
            ref:'User',
            required:true
      },
      astrologerId:{
            type:mongoose.Schema.ObjectId,
            ref:'Astrologer',
            required:true
      },
      message: {
            type: String,
            required: true
          },
          status: {
            type: String,
            enum: ['pending', 'accepted', 'declined'],
            default: 'pending'
          },
          createdAt: {
            type: Date,
            default: Date.now
          }
      
})
const MessageRequest = mongoose.model('MessageRequest', MessageReuestSchema);
 module.exports = MessageRequest;