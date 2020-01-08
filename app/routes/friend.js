const express = require('express');
const router = express.Router();
const friendController = require("../controllers/friendController");
const appConfig = require("../../config/appConfig")
const auth = require('../middlewares/auth')

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/friends`;

 app.get(`${baseUrl}/view/friend/request/sent/:userId`, auth.isAuthorized, friendController.getAllRequestSent);
      /**
     * @apiGroup friends
     * @apiVersion  1.0.0
     * @api {get} /api/v1/friends/view/friend/request/sent/:userId api for Getting all friends request sent.
     *
     * @apiParam {string} authToken authToken of the user. (query/body/header params) (required)
     * @apiParam {string} userId Id of the user. (header params) (required)
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
      * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "All Sent Requsts Found",
            "status": 200,
            "data": [
                {
                    "_id": "5e0e4088ed21f207087fad8e",
                    "friendRequestSent": [
                        {
                            "friendId": "poRnwhbu",
                            "friendName": "Senthil Kumar",
                            "_id": "5e10351040fb6950f080088f"
                        }
                    ]
                }
            ]
        }
    */

 app.get(`${baseUrl}/view/friend/request/received/:userId`, auth.isAuthorized, friendController.getAllRequestReceived);
 /**
    * @apiGroup friends
    * @apiVersion  1.0.0
    * @api {get} /api/v1/friends/view/friend/request/received/:userId api for Getting all friends request Received.
    *
    * @apiParam {string} authToken authToken of the user. (query/body/header params) (required)
    * @apiParam {string} UserId Id of the user. (header params) (required)
    * 
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
    {
        "error": false,
        "message": "All Received Requsts Found",
        "status": 200,
        "data": [
            {
                "_id": "5e0e4088ed21f207087k6210f3",
                "friendRequestReceived": [
                    {
                        "friendId": "SJ70bQL97",
                        "friendName": "kumar senthil",
                        "_id": "5e10351040fb6950fsw362f"
                    }
                ]
            }
        ]
    }
   */
 app.post(`${baseUrl}/send/friend/request`, auth.isAuthorized,friendController.sendFriendRequest);
 /**
     * @apiGroup friends
     * @apiVersion  1.0.0
     * @api {get} /api/v1/friends/send/friend/request api for Sending Friend Request.
     *
     * @apiParam {string} authToken authToken of the user. (query/body/header params) (required)
     * @apiParam {string} senderId Id of the Sender. (body params) (required)
     * @apiParam {string} senderName Name of the Sender. (body params) (required)
     * @apiParam {string} receiverId Id of the Receiver. (body params) (required)
     * @apiParam {string} receiverName Name of the Receiver. (body params) (required)
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Friend Request Sent",
            "status": 200,
            "data": null
        }
    */
 app.post(`${baseUrl}/accept/friend/request`, auth.isAuthorized,friendController.acceptFriendRequest);
  /**
    * @apiGroup friends
    * @apiVersion  1.0.0
    * @api {get} /api/v1/friends/accept/friend/request api for Accepting Friend Request.
    *
    * @apiParam {string} authToken authToken of the user. (query/body/header params) (required)
    * @apiParam {string} senderId Id of the Sender. (body params) (required)
    * @apiParam {string} senderName Name of the Sender. (body params) (required)
    * @apiParam {string} receiverId Id of the Receiver(Login User). (body params) (required)
    * @apiParam {string} receiverName Name of the Receiver(Login User). (body params) (required)
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
       {
           "error": false,
           "message": "Accepted Friend Request",
           "status": 200,
           "data": null
       }
   */

 app.post(`${baseUrl}/cancel/friend/request`, auth.isAuthorized,friendController.cancelFriendRequest);
 /**
  * @apiGroup friends
  * @apiVersion  1.0.0
  * @api {get} /api/v1/friends/cancel/friend/request api to Cancel Friend Request.
  *
  * @apiParam {string} authToken authToken of the user. (query/body/header params) (required)
  * @apiParam {string} senderId Id of the Sender(Login User). (body params) (required)
  * @apiParam {string} senderName Name of the Sender(Login User). (body params) (required)
  * @apiParam {string} receiverId Id of the Receiver. (body params) (required)
  * @apiParam {string} receiverName Name of the Receiver. (body params) (required)
  * @apiSuccess {object} myResponse shows error status, message, http status code, result.
  * 
  * @apiSuccessExample {object} Success-Response:
     {
         "error": false,
         "message": "Cancelled Friend Request",
         "status": 200,
         "data": null
     }
 */
app.post(`${baseUrl}/reject/friend/request`, auth.isAuthorized,friendController.rejectFriendRequest);
 /**
  * @apiGroup friends
  * @apiVersion  1.0.0
  * @api {get} /api/v1/friends/reject/friend/request api to Reject Friend Request.
  *
  * @apiParam {string} authToken authToken of the user. (query/body/header params) (required)
  * @apiParam {string} senderId Id of the Sender(Login User). (body params) (required)
  * @apiParam {string} senderName Name of the Sender(Login User). (body params) (required)
  * @apiParam {string} receiverId Id of the Receiver. (body params) (required)
  * @apiParam {string} receiverName Name of the Receiver. (body params) (required)
  * @apiSuccess {object} myResponse shows error status, message, http status code, result.
  * 
  * @apiSuccessExample {object} Success-Response:
     {
         "error": false,
         "message": "Friend Request Rejected",
         "status": 200,
         "data": null
     }
 */


 app.post(`${baseUrl}/unfriend/user`, auth.isAuthorized,friendController.unfriendFunction);
        /**
         * @apiGroup friends
         * @apiVersion  1.0.0
         * @api {get} /api/v1/friends/unfriend/user api to Unfriend user.
         *
         * @apiParam {string} authToken authToken of the user. (query/body/header params) (required)
         * @apiParam {string} senderId Id of the Sender. (body params) (required)
         * @apiParam {string} senderName Name of the Sender. (body params) (required)
         * @apiParam {string} receiverId Id of the Receiver(Login User). (body params) (required)
         * @apiParam {string} receiverName Name of the Receiver(Login User). (body params) (required)
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
            {
                "error": false,
                "message": "Canceled Friend Request",
                "status": 200,
                "data": null
            }
        */
}


