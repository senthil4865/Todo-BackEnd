const express = require('express');
const router = express.Router();
const todoController = require("./../../app/controllers/todoController");
const appConfig = require("./../../config/appConfig");
const auth = require('./../middlewares/auth');
const notifyController = require("./../controllers/notifyController");
const listController = require("./../controllers/listController");

module.exports.setRouter=(app)=>{

     let baseUrl = `${appConfig.apiVersion}/lists`;
     app.post(`${baseUrl}/addList`, auth.isAuthorized, listController.addListFunction);
      /**
     * @apiGroup lists
     * @apiVersion  1.0.0
     * @api {post} /api/v1/lists/addList api to Add List.
     *
     * @apiParam {string} authToken Authentication Token. (body/header/query params) (required)
     * @apiParam {string} listName Name of the List. (body params) (required)
     * @apiParam {string} listId LisId of the List. (header params) (required)
     * @apiParam {string} listCreatedBy User Id of the user creating todo. (body params) (required)
     * @apiParam {string} listModifiedBy User Id of the user Modifying the todo. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        { 
            "error": false,
            "message": "List Created",
            "status": 200,
            "data": {
               __v: 0
               ListCreatedBy: "5e0e4088ed21f207087fad8e"
               ListModifiedBy: "5e0e4088ed21f207087fad8e"
               _id: "5e103ab17c71e669e888619f"
               Todos: []
               ListModifiedDate: "2020-01-04T07:11:45.000Z"
               ListCreatedDate: "2020-01-04T07:11:45.000Z"
               ListName: "Learn HttpService"
               ListId: "HcQ_JEja" 
            }
        }    
    */
     app.get(`${baseUrl}/:userId`,auth.isAuthorized,listController.getAllListsFunction);
     /**
     * @apiGroup lists
     * @apiVersion  1.0.0
     * @api {get} /api/v1/lists/view/all/lists/:userId api for Getting all Lists of User.
     *
     * @apiParam {string} userId userId of the user. (header params) (required)
     * @apiParam {string} authToken Authentication Token. (body/header/query params) (required)
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Lists Found and Listed",
            "status": 200,
            "data": [
                {
                  _id: "5e103ab17c71e669e888619f"
                  ListCreatedBy: "5e0e4088ed21f207087fad8e"
                  ListModifiedBy: "5e0e4088ed21f207087fad8e"
                  Todos: []
                  ListModifiedDate: "2020-01-04T07:11:45.000Z"
                  ListCreatedDate: "2020-01-04T07:11:45.000Z"
                  ListName: "Learn HttpService"
                  ListId: "HcQ_JEja"
                  __v: 0
                }
            ]
        }
    */
     app.post(`${baseUrl}/:listId/updateList`, auth.isAuthorized, listController.updateListFunction);
      /**
     * @apiGroup lists
     * @apiVersion  1.0.0
     * @api {post} /api/v1/lists/:listId/updateList api to Update List Details.
     *
     * @apiParam {string} authToken Authentication Token. (body/header/query params) (required)
     * @apiParam {string} ListName Name of the List. (body params) (required)
     * @apiParam {string} ListModifiedBy User Id of the user modifying todo. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "List details Updated",
            "status": 200,
            "data": {
                n: 1
                nModified: 1
                ok: 1
            }
        }    
    */
     app.post(`${baseUrl}/:listId/deleteList`, auth.isAuthorized, listController.deleteListFunction);
       /**
     * @apiGroup lists
     * @apiVersion  1.0.0
     * @api {post} /api/v1/lists/:ListId/delete api to Delete List.
     *
     * @apiParam {string} ListId ListId of the List to be deleted. (header params) (required)
     * @apiParam {string} authToken Authentication Token. (body/header/query params) (required)
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Deleted the List successfully",
            "status": 200,
            "data": null
        }
    */

}