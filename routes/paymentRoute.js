const express = require("express");
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

router.post("/orders", async (req, res) =>{
    let instance = new Razorpay({key_id: 'rzp_test_aETqDyWsFWDmE9', key_secret: 'XKNILJrOh25b4rCiqHRbbmYN'});
    var options = {
        amount: req.body.amount*100,
        currency: "INR"
    };
    instance.orders.create(options, function(err, order){
        if(err){
            return res.send({code: 500, message: 'Server Error'});
        }
        return res.send({code: 200, message: 'Order Created', data: order});
    })

})
router.post("/verify", async (req, res) =>{
    let body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;
    var expectedSignature = crypto.createHmac('sha256', 'XKNILJrOh25b4rCiqHRbbmYN')
    .update(body.toString())
    .digest('hex');

    
    if(expectedSignature === req.body.response.razorpay_signature){
        res.send({code: 200, message: "Signature is Valid"})
    }
    else{
        res.send({code: 500, message: "Signature is InValid"})
    }
    
})

module.exports = router;