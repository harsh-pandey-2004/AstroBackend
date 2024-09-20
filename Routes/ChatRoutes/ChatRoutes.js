const express=require('express');
const {getAllChats,getAstroChats,createChat,getAstroChatBasisOfRoomId}=require('../../Controller/ChatControllers/ChatControllers');
const router=express.Router();
router.post('/createchat',createChat);

router.get('/getallchats',getAllChats);
router.post('/getastrochats',getAstroChats);
router.post('/getastrochatbasisofroomId',getAstroChatBasisOfRoomId);
module.exports=router;