const {check} = require('express-validator');
exports.registerValidator=[
    check('name','Name is required').not().isEmpty(),
    check('mobile','Mobile no. should be contain 10 digits').isLength({
        min:10,
        max:10
    }),
];

exports.loginValidation=[
    check('mobile','Mobile no. should be contain 10 digits').isLength({
        min:10,
        max:10
    }),
];

exports.AstrologerValidation=[
    
        check('name','Name is required').not().isEmpty(),
        check('email','Please include a valid email').isEmail().normalizeEmail({
            gmail_remove_dots:true
        }),
        check('image').custom((value,{req})=>{
            if(req.file.mimetype==='image/jpeg'||req.file.mimetype==='image/png'){
                return true;
            }
            else{
                return false;
            }
        }).withMessage("Please upload an image in JPEG or in PNG")
]
