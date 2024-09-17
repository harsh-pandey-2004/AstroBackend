const express=require('express');
const {getAllChats,getAstroChats}=require('../../Controller/ChatController/ChatController');
const router=express.Router();
router.get('/getallchats',getAllChats);
router.post('/getastrochats',getAstroChats);
module.exports=router;

