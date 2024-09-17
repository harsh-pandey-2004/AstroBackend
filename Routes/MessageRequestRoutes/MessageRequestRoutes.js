const express=require('express');
const {getAllMessageRequests}=require('../../Controller/MessaageRequestController/MessageRequestController');
const router=express.Router();
router.get('/getallmessagerequests',getAllMessageRequests);

module.exports=router;