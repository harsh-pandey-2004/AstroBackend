const express=require('express');
const {getAllMessageRequests,getMessageRequestOnTheBasisOfStatus,newMessageRequest,statusUpdate}=require('../../Controller/MessageRequestController/MessageRequestController');
const router=express.Router();
router.post('/message-request',newMessageRequest);
router.put('/statusupdate',statusUpdate);
router.get('/getallmessagerequests',getAllMessageRequests);
router.get('/getmessagerequestonthebasisofstatus',getMessageRequestOnTheBasisOfStatus);

module.exports=router;