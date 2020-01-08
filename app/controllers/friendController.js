const mongoose = require('mongoose');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const check = require('../libs/checkLib')
const User=require('../models/User');


let sendFriendRequest = (req, res) => {
    let validateUserInput = () => {
        return new Promise((resolve, reject) => {
            if (req.body.senderId && req.body.senderName && req.body.receiverId && req.body.receiverName) {
                    resolve(req)
            } else {
                logger.error('Field Missing During Sending request', 'friendController: sendFriendRequest', 5)
                let apiResponse = response.generate(true, 'One or More Parameter(s) is missing', 400, null)
                reject(apiResponse)
            }
        })
    }

    let updateSender = () => {
        let subOptions = {
            friendId: req.body.receiverId,
            friendName: req.body.receiverName,
        }

        let options = {
            $push: { 
                friendRequestSent: { $each: [ subOptions ] } 
            } 
        }

        return new Promise((resolve, reject) => {
            User.updateOne({userId: req.body.senderId }, options).exec((err, result) => {
                if (err) {
                    logger.error(err.message, 'Friend Controller:sendFriendRequest-updateSender', 10)
                    let apiResponse = response.generate(true, 'Failed To Update Sender', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('Sender not Found', 'Friend Controller: sendFriendRequest-updateSender')
                    let apiResponse = response.generate(true, 'Sender not Found', 404, null)
                    reject(apiResponse)
                } else {
                    let apiResponse = response.generate(false, 'Updated Sender with sent requests', 200, null)
                    resolve(apiResponse)

                }
            });
        })
    }

    let updateReceiver = () => {
        let subOptions = {
            friendId: req.body.senderId,
            friendName: req.body.senderName,
        }

        let options = {
            $push: { 
                friendRequestReceived: { $each: [ subOptions ]                     
                } 
            } 
        }

        return new Promise((resolve, reject) => {
            User.updateOne({userId: req.body.receiverId }, options).exec((err, result) => {
                if (err) {
                    logger.error(err.message, 'Friend Controller:sendFriendRequet-updateReceiver', 10)
                    let apiResponse = response.generate(true, 'Failed To Update receiver', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('receiver not Found', 'Friend Controller: sendFriendRequet-updateReceiver')
                    let apiResponse = response.generate(true, 'receiver not Found', 404, null)
                    reject(apiResponse)
                } else {
                    resolve(result)
                }
            });
        })
    } 

    validateUserInput(req, res)
        .then(updateSender)
        .then(updateReceiver)
        .then((resolve) => {            
            let apiResponse = response.generate(false, 'Friend Request Sent', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.status(err.status)
            res.send(err)
        })
}


let getAllRequestReceived = (req, res) => {
    User.find({userId:req.params.userId})
        .select('friendRequestReceived')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Friend Controller: getAllRequestReceived', 10)
                let apiResponse = response.generate(true, 'Failed To Find Received Requests', 500, null)
                res.send(apiResponse)
            } else
             {
                let apiResponse = response.generate(false, 'All Received Requests Found', 200, result)
                res.send(apiResponse)
            }
        })
}



let getAllRequestSent = (req, res) => {
    User.find({userId:req.params.userId})
        .select('friendRequestSent')
        .lean()
        .exec((err, result) => {
            console.log(result);
            if (err) {
                console.log(err)
                logger.error(err.message, 'Friend Controller: getAllRequestSent', 10)
                let apiResponse = response.generate(true, 'Failed To Find Sent Requests', 500, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All Sent Requests Found', 200, result)
                res.send(apiResponse)
            }
        })
}


let cancelFriendRequest = (req, res) => {

    let validateUserInput = () => {
        return new Promise((resolve, reject) => {
            if (req.body.senderId && req.body.senderName && req.body.receiverId && req.body.receiverName) {
                    resolve(req)
            } else {
                logger.error('Field Missing During Sending request', 'friendController: sendFriendRequest', 5)
                let apiResponse = response.generate(true, 'One or More Parameter(s) is missing', 400, null)
                reject(apiResponse)
            }
        })
    }

    let updateSender = () => {

        let options = {
            $pull: { 
                friendRequestSent: {  
                    friendId: req.body.receiverId,
                    friendName: req.body.receiverName } 
            } 
        }

        return new Promise((resolve, reject) => {
            User.update({userId: req.body.senderId }, options,{safe: true}).exec((err, result) => {
                if (err) {
                    logger.error(err.message, 'Friend Controller:cancelFriendRequest-updateSender', 10)
                    let apiResponse = response.generate(true, 'Failed To Update Sender', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('Sender not Found', 'Friend Controller:cancelFriendRequest-updateSender')
                    let apiResponse = response.generate(true, 'Sender not Found', 404, null)
                    reject(apiResponse)
                } else {
                    let apiResponse = response.generate(false, 'Updated Sender with sent requests', 200, null)
                    resolve(apiResponse)
                
                }
            });
        })
    }

    let updateReceiver = () => {
 
        let options = {
            $pull: { 
                friendRequestReceived: {   friendId: req.body.senderId,
                    friendName: req.body.senderName } 
            } 
        }

        return new Promise((resolve, reject) => {
            User.update({ userId: req.body.receiverId }, options,{safe:true}).exec((err, result) => {
                console.log(result,'result receiver');
                if (err) {
                    logger.error(err.message, 'Friend Controller:cancelFriendRequest-updateReceiver', 10)
                    let apiResponse = response.generate(true, 'Failed To Update receiver', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('receiver not Found', 'Friend Controller:cancelFriendRequest-updateReceiver')
                    let apiResponse = response.generate(true, 'Receiver not Found', 404, null)
                    reject(apiResponse)
                } else {
                    resolve(result)
                }
            });
        })
    } 

    validateUserInput(req, res)
        .then(updateSender)
        .then(updateReceiver)
        .then((resolve) => {            
            let apiResponse = response.generate(false, 'Cancelled Friend Request', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.status(err.status)
            res.send(err)
        })
}





let rejectFriendRequest = (req, res) => {

    let validateUserInput = () => {
        return new Promise((resolve, reject) => {
            if (req.body.senderId && req.body.senderName && req.body.receiverId && req.body.receiverName) {
                    resolve(req)
            } else {
                logger.error('Field Missing During Sending request', 'friendController: rejectFriendRequest', 5)
                let apiResponse = response.generate(true, 'One or More Parameter(s) is missing', 400, null)
                reject(apiResponse)
            }
        })
    }

    let updateSender = () => {

        let options = {
            $pull: { 
                friendRequestReceived: {  
                    friendId: req.body.receiverId,
                    friendName: req.body.receiverName } 
            } 
        }

        return new Promise((resolve, reject) => {
            User.update({userId: req.body.senderId }, options,{safe: true}).exec((err, result) => {
          
                if (err) {
                    logger.error(err.message, 'Friend Controller:rejectFriendRequest-updateSender', 10)
                    let apiResponse = response.generate(true, 'Failed To Update Sender', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('Sender not Found', 'Friend Controller:rejectFriendRequest-updateSender')
                    let apiResponse = response.generate(true, 'Sender not Found', 404, null)
                    reject(apiResponse)
                } else {
                    let apiResponse = response.generate(false, 'Updated Sender with sent requests', 200, null)
                    resolve(apiResponse)
                
                }
            });
        })
    } 

    let updateReceiver = () => {
 
        let options = {
            $pull: { 
                friendRequestSent: {   friendId: req.body.senderId,
                    friendName: req.body.senderName } 
            } 
        }

        return new Promise((resolve, reject) => {
            User.update({ userId: req.body.receiverId }, options,{safe:true}).exec((err, result) => {
                console.log(result,'result receiver');
                if (err) {
                    //console.log("Error in verifying" + err)
                    logger.error(err.message, 'Friend Controller:rejectFriendRequest-updateReceiver', 10)
                    let apiResponse = response.generate(true, 'Failed To Update receiver', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('receiver not Found', 'Friend Controller:rejectFriendRequest-updateReceiver')
                    let apiResponse = response.generate(true, 'Receiver not Found', 404, null)
                    reject(apiResponse)
                } else {
                    resolve(result)
                }
            });
        })
    } 

    validateUserInput(req, res)
        .then(updateSender)
        .then(updateReceiver)
        .then((resolve) => {            
            let apiResponse = response.generate(false, 'Friend Request Rejected', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.status(err.status)
            res.send(err)
        })
}




let acceptFriendRequest = (req, res) => {
    let validateUserInput = () => {
        return new Promise((resolve, reject) => {
            if (req.body.senderId && req.body.senderName && req.body.receiverId && req.body.receiverName) {
                    resolve(req)
            } else {
                logger.error('Field Missing During Accepting request', 'friendController: acceptFriendRequest', 5)
                let apiResponse = response.generate(true, 'One or More Parameter(s) is missing', 400, null)
                reject(apiResponse)
            }
        })
    }

    let updateSenderFriendList = () => {
        
        let subOptions = {
            friendId: req.body.receiverId,
            friendName: req.body.receiverName,
        }

        let options = {
            $push: { 
                friends: { $each: [ subOptions ]                     
                } 
            } 
        }

        return new Promise((resolve, reject) => {
            User.update({ userId: req.body.senderId }, options).exec((err, result) => {
                if (err) {
                    logger.error(err.message, 'Friend Controller:acceptFriendRequest-updateSenderFriendList', 10)
                    let apiResponse = response.generate(true, 'Failed To Update Sender Friend List', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('Sender not Found', 'Friend Controller:acceptFriendRequest-updateSenderFriendList')
                    let apiResponse = response.generate(true, 'Sender not Found', 404, null)
                    reject(apiResponse)
                } else {
                    let apiResponse = response.generate(false, 'Updated Sender Friend List', 200, null)
                    resolve(apiResponse)
                }
            });
        })
    } 

    let updateReceiverFriendList = () => {
        
        let subOptions = {
            friendId: req.body.senderId,
            friendName: req.body.senderName,
        }

        let options = {
            $push: { 
                friends: { $each: [ subOptions ]                     
                } 
            } 
        }

        return new Promise((resolve, reject) => {
            User.update({ userId: req.body.receiverId }, options).exec((err, result) => {
                if (err) {
                    logger.error(err.message, 'Friend Controller:acceptFriendRequest-updateReceiverFriendList', 10)
                    let apiResponse = response.generate(true, 'Failed To Update Reciver Friend List', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('Reciver not Found', 'Friend Controller:acceptFriendRequest-updateReceiverFriendList')
                    let apiResponse = response.generate(true, 'Receiver not Found', 404, null)
                    reject(apiResponse)
                } else {
                    let apiResponse = response.generate(false, 'Updated Receiver Friend List', 200, null)
                    resolve(apiResponse)
                }
            });
        })
    } 

    let updateReceiverSentRequest = () => {
        
        let options = {
            $pull: { 
                friendRequestSent: {
                    friendId:req.body.senderId,
                    friendName:req.body.senderName                     
                } 
            } 
        }

        return new Promise((resolve, reject) => {
            User.update({ userId: req.body.receiverId }, options).exec((err, result) => {
                if (err) {
                    logger.error(err.message, 'Friend Controller:acceptFriendRequest-updateReceiverSentRequest', 10)
                    let apiResponse = response.generate(true, 'Failed To Update Reciver Friend List', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('Reciver not Found', 'Friend Controller:acceptFriendRequest-updateReceiverSentRequest')
                    let apiResponse = response.generate(true, 'Receiver not Found', 404, null)
                    reject(apiResponse)
                } else {
                    let apiResponse = response.generate(false, 'Updated Receiver Friend List', 200, null)
                    resolve(apiResponse)
                }
            });
        })
    } 

    let updateSenderRequestReceived = () => {
        
        let options = {
            $pull: { 
                friendRequestReceived: {
                    friendId:req.body.receiverId,
                    friendName:req.body.receiverName                     
                } 
            } 
        }

        return new Promise((resolve, reject) => {
            User.update({ userId: req.body.senderId }, options).exec((err, result) => {
                if (err) {
                    logger.error(err.message, 'Friend Controller:acceptFriendRequest-updateSenderRequestReceived', 10)
                    let apiResponse = response.generate(true, 'Failed To Update receiver Requests Received', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('Receiver not Found', 'Friend Controller:acceptFriendRequest-updateSenderRequestReceived')
                    let apiResponse = response.generate(true, 'Receiver not Found', 404, null)
                    reject(apiResponse)
                } else {
                    let apiResponse = response.generate(false, 'Updated Receivers Requests Received', 200, null)
                    resolve(apiResponse)
                }
            });
        })
    } 

    validateUserInput(req, res)
        .then(updateSenderFriendList)
        .then(updateReceiverFriendList)
        .then(updateReceiverSentRequest)
        .then(updateSenderRequestReceived)
        .then((resolve) => {            
            let apiResponse = response.generate(false, 'Accepted Friend Request', 200, null)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.status(err.status)
            res.send(err)
        })
}


let unfriendFunction = (req, res) => {
    let validateUserInput = () => {
        return new Promise((resolve, reject) => {
            if (req.body.senderId && req.body.senderName && req.body.receiverId && req.body.receiverName) {
                    resolve(req)
            } else {
                logger.error('Field Missing During Accepting request', 'friendController: unfriendFunction', 5)
                let apiResponse = response.generate(true, 'One or More Parameter(s) is missing', 400, null)
                reject(apiResponse)
            }
        })
    }

    let updateSenderFriendList = () => {
        
        let options = {
            $pull: { 
                friends : 
                 {  friendId: req.body.receiverId,
                    friendName: req.body.receiverName 
                } 
            } 
        }

        return new Promise((resolve, reject) => {
            User.update({userId: req.body.senderId }, options).exec((err, result) => {
                if (err) {
                    logger.error(err.message, 'Friend Controller:unfriendFunction-updateSenderFriendList', 10)
                    let apiResponse = response.generate(true, 'Failed To Update Sender Friend List', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('Sender not Found', 'Friend Controller: unfriendFunction-updateSenderFriendList')
                    let apiResponse = response.generate(true, 'Sender not Found', 404, null)
                    reject(apiResponse)
                } else {
                    let apiResponse = response.generate(false, 'Updated Sender Friend List', 200, null)
                    resolve(apiResponse)
                }
            });
        })
    } 

    let updateReceiverFriendList = () => {
        
        let options = {
            $pull: { 
                friends: {   friendId: req.body.senderId,
                    friendName: req.body.senderName } 
            } 
        }

        return new Promise((resolve, reject) => {
            User.update({userId: req.body.receiverId }, options).exec((err, result) => {
                if (err) {
                    //console.log("Error in verifying" + err)
                    logger.error(err.message, 'Friend Controller:unfriendFunction-updateReceiverFriendList', 10)
                    let apiResponse = response.generate(true, 'Failed To Update Receiver Friend List', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('Reciver not Found', 'Friend Controller: unfriendFunction-updateReceiverFriendList')
                    let apiResponse = response.generate(true, 'Receiver not Found', 404, null)
                    reject(apiResponse)
                } else {
                    let apiResponse = response.generate(false, 'Updated Receiver Friend List', 200, null)
                    resolve(apiResponse)
                }
            });
        })
    } 


    validateUserInput(req, res)
        .then(updateSenderFriendList)
        .then(updateReceiverFriendList)
        .then((resolve) => {            
            let apiResponse = response.generate(false, 'Unfriend User', 200, null)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.status(err.status)
            res.send(err)
        })
}



module.exports = {
   getAllRequestSent:getAllRequestSent,
   getAllRequestReceived:getAllRequestReceived,
   sendFriendRequest:sendFriendRequest,
   acceptFriendRequest:acceptFriendRequest,
   rejectFriendRequest:rejectFriendRequest,
   cancelFriendRequest:cancelFriendRequest,
   unfriendFunction:unfriendFunction

}