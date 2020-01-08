const express = require('express');
const router = express.Router();
const todoController = require("./../../app/controllers/todoController");
const appConfig = require("./../../config/appConfig");
const auth = require('./../middlewares/auth');
const notifyController = require("./../controllers/notifyController");


module.exports.setRouter=(app)=>{

     let baseUrl = `${appConfig.apiVersion}/todo`;

       app.post(`${baseUrl}/addTodo`,todoController.addTodoFunction);
        /**
     * @apiGroup todo
     * @apiVersion  1.0.0
     * @api {post} /api/v1/todo/addTodo api to Add Todo.
     *
     * @apiParam {string} ownerList _id of the List to which Todo is going to be added. (body params) (required)
     * @apiParam {string} todoName Name of the Todo. (body params) (required)
     * @apiParam {string} todoDescription Description for the todo. (body params)
     * @apiParam {string} todoCreatedBy UserId of the todo creator. (body params) (required)
     * @apiParam {string} todoModifiedBy UserId of the todo modifier. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Todo Created",
            "status": 200,
            "data": {
           __v: 0
           ownerList: "5e0e4168ed21f207087fad9d"
           todoCreatedBy: "5e0e4088ed21f207087fad8e"
           todoModifiedBy: "5e0e4088ed21f207087fad8e"
           _id: "5e105824009ece2a90415af4"
           subtodo: []
           completed: false
           todoModifiedDate: "2020-01-04T09:17:24.000Z"
           todoCreatedDate: "2020-01-04T09:17:24.000Z"
           todoDescription: "AngularAngular"
           todoName: "AngularAngular"
           todoId: "Ss73Vdnz"
            }
        }
    */
       
       app.get(`${baseUrl}/:id/getAllTodos`, todoController.getAllTodosFunction);
      /**
     * @apiGroup todo
     * @apiVersion  1.0.0
     * @api {get} /api/v1/todo/:id/getAllTodo api to get all Todos.
     *
     * @apiParam {string} ListId _id of the List from which all todos need to get. (header params) (required)
     * @apiParam {string} pageSize Size of the page. (query params) (required)
     * @apiParam {string} pageIndex current Index of page. (query params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Todos Found and Listed",
            "status": 200,
            "data": {
              __v: 0
              _id: "5e0e41c8ed21f207087fada2"
              ownerList: "5e0e4168ed21f207087fad9d"
              todoCreatedBy: {_id: "5e0e4088ed21f207087fad8e", friendRequestSent: Array(1), friendRequestReceived: Array(0), friends: Array(1), emailVerified: "Yes", …}
              todoModifiedBy: {_id: "5e0e4088ed21f207087fad8e", friendRequestSent: Array(1), friendRequestReceived: Array(0), friends: Array(1), emailVerified: "Yes", …}
              subtodo: []
              completed: true
              todoModifiedDate: "2020-01-03T16:08:14.000Z"
              todoCreatedDate: "2020-01-02T19:17:28.000Z"
              todoDescription: "myTodo"
              todoName: "main task"
              todoId: "6zBHYyFe"
            }
        }
    */

       app.post(`${baseUrl}/:todoId/addSubTodo`, todoController.addSubTodoFunction);
            /**
     * @apiGroup todo
     * @apiVersion  1.0.0
     * @api {post} /api/v1/todo/:todoId/addSubTodo api to Add Sub Todo.
     *
     * @apiParam {string} ownerTodo _id of the Main Todo to which Sub Todo is going to be added. (body params) (required)
     * @apiParam {string} subTodoName Name of the  Sub Todo. (body params) (required)
     * @apiParam {string} subTodoDescription Description for the sub todo. (body params)
     * @apiParam {string} subTodoCreatedBy UserId of the sub todo creator. (body params) (required)
     * @apiParam {string} subTodoModifiedBy UserId of the sub todo modifier. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Sub Todo Created",
            "status": 200,
            "data": {
              _id: "5e0e41c8ed21f207087fada2"
              ownerList: "5e0e4168ed21f207087fad9d"
              todoCreatedBy: {_id: "5e0e4088ed21f207087fad8e", friendRequestSent: Array(1), friendRequestReceived: Array(0), friends: Array(1), emailVerified: "Yes", …}
              todoModifiedBy: {_id: "5e0e4088ed21f207087fad8e", friendRequestSent: Array(1), friendRequestReceived: Array(0), friends: Array(1), emailVerified: "Yes", …}
              subtodo: Array(1)
              0:
              _id: "5e105b76ea5820600487ba1d"
              ownerTodo: "5e0e41c8ed21f207087fada2"
              subTodoCreatedBy: "5e0e4088ed21f207087fad8e"
              subTodoModifiedBy: "5e0e4088ed21f207087fad8e"
              completed: false
              subTodoModifiedDate: "2020-01-04T09:31:34.000Z"
              subTodoCreatedDate: "2020-01-04T09:31:34.000Z"
              subTodoDescription: " "
              subTodoName: "subTask"
              subTodoId: "5JC2tjzX"
              __v: 0
              completed: false
              todoModifiedDate: "2020-01-03T16:08:14.000Z"
              todoCreatedDate: "2020-01-02T19:17:28.000Z"
              todoDescription: "myTodo"
              todoName: "main task"
              todoId: "6zBHYyFe"
            }
        }
    */


       app.post(`${baseUrl}/changeCompleteState`, todoController.changeStateFunction);
       /**
     * @apiGroup todo
     * @apiVersion  1.0.0
     * @api {post} /api/v1/todo/changeCompleteState api to Make todo open and close(Done & Pending).
     *
     * @apiParam {string} todoId   todoId of the todo to which the state needs to be changed. (body params) (required)
     * @apiParam {string} checkedState State of the todo. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Todo Checked State Updated",
            "status": 200,
            "data": {
              _id: "5e0e41c8ed21f207087fada2"
              ownerList: "5e0e4168ed21f207087fad9d"
              todoCreatedBy: {_id: "5e0e4088ed21f207087fad8e", friendRequestSent: Array(1), friendRequestReceived: Array(0), friends: Array(1), emailVerified: "Yes", …}
              todoModifiedBy: {_id: "5e0e4088ed21f207087fad8e", friendRequestSent: Array(1), friendRequestReceived: Array(0), friends: Array(1), emailVerified: "Yes", …}
              subtodo: Array(1)
              0:
              _id: "5e105b76ea5820600487ba1d"
              ownerTodo: "5e0e41c8ed21f207087fada2"
              subTodoCreatedBy: "5e0e4088ed21f207087fad8e"
              subTodoModifiedBy: "5e0e4088ed21f207087fad8e"
              completed: false
              subTodoModifiedDate: "2020-01-04T09:31:34.000Z"
              subTodoCreatedDate: "2020-01-04T09:31:34.000Z"
              subTodoDescription: " "
              subTodoName: "subTask"
              subTodoId: "5JC2tjzX"
              __v: 0
              completed: true
              todoModifiedDate: "2020-01-03T16:08:14.000Z"
              todoCreatedDate: "2020-01-02T19:17:28.000Z"
              todoDescription: "myTodo"
              todoName: "main task"
              todoId: "6zBHYyFe"
            }
        }
    */


       app.post(`${baseUrl}/changeCompleteStateSubTodo`, todoController.changeStatesubTodoFunction);
     /**
     * @apiGroup todo
     * @apiVersion  1.0.0
     * @api {post} /api/v1/todo/changeCompleteStateSubTodo api to Make Sub todo open and close(Done & Pending).
     *
     * @apiParam {string} subTodoId   subTodoId of the subTodo to which the state needs to be changed. (body params) (required)
     * @apiParam {string} checkedState State of the sub todo. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "sub Todo Checked State Updated",
            "status": 200,
            "data": {
              _id: "5e0e41c8ed21f207087fada2"
              ownerList: "5e0e4168ed21f207087fad9d"
              todoCreatedBy: {_id: "5e0e4088ed21f207087fad8e", friendRequestSent: Array(1), friendRequestReceived: Array(0), friends: Array(1), emailVerified: "Yes", …}
              todoModifiedBy: {_id: "5e0e4088ed21f207087fad8e", friendRequestSent: Array(1), friendRequestReceived: Array(0), friends: Array(1), emailVerified: "Yes", …}
              subtodo: Array(1)
              0:
              _id: "5e105b76ea5820600487ba1d"
              ownerTodo: "5e0e41c8ed21f207087fada2"
              subTodoCreatedBy: "5e0e4088ed21f207087fad8e"
              subTodoModifiedBy: "5e0e4088ed21f207087fad8e"
              completed: true
              subTodoModifiedDate: "2020-01-04T09:31:34.000Z"
              subTodoCreatedDate: "2020-01-04T09:31:34.000Z"
              subTodoDescription: " "
              subTodoName: "subTask"
              subTodoId: "5JC2tjzX"
              __v: 0
              completed: true
              todoModifiedDate: "2020-01-03T16:08:14.000Z"
              todoCreatedDate: "2020-01-02T19:17:28.000Z"
              todoDescription: "myTodo"
              todoName: "main task"
              todoId: "6zBHYyFe"
            }
        }
    */
   
       app.get(`${baseUrl}/:id/todoDetails`, todoController.getTodoDetails);
         /**
     * @apiGroup todo
     * @apiVersion  1.0.0
     * @api {get} /api/v1/todo/:id/todoDetails api to get Todo details of a particular Todo.
     *
     * @apiParam {string} todoId of the todo to get the details. (header params) (required)
     * @apiParam {string} authToken Authentication Token. (body/header/query params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Todo Details Found",
            "status": 200,
            "data": {
              __v: 0
              _id: "5e0e41c8ed21f207087fada2"
              ownerList: "5e0e4168ed21f207087fad9d"
              todoCreatedBy: {_id: "5e0e4088ed21f207087fad8e", friendRequestSent: Array(1), friendRequestReceived: Array(0), friends: Array(1), emailVerified: "Yes", …}
              todoModifiedBy: {_id: "5e0e4088ed21f207087fad8e", friendRequestSent: Array(1), friendRequestReceived: Array(0), friends: Array(1), emailVerified: "Yes", …}
              subtodo: []
              completed: true
              todoModifiedDate: "2020-01-03T16:08:14.000Z"
              todoCreatedDate: "2020-01-02T19:17:28.000Z"
              todoDescription: "myTodo"
              todoName: "main task"
              todoId: "6zBHYyFe"
            }
        }
    */


       app.get(`${baseUrl}/:listId/getListById`,auth.isAuthorized,todoController.getAllTodosByListId);
      /**
     * @apiGroup todo
     * @apiVersion  1.0.0
     * @api {get} /api/v1/todo/:listId/getListById api to get all Todos under a List.
     *
     * @apiParam {string} listId of the List to get all Todos under It. (header params) (required)
     * @apiParam {string} authToken Authentication Token. (body/header/query params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Todo Details Found",
            "status": 200,
            "data": {
              __v: 0
              _id: "5e0e41c8ed21f207087fada2"
              ownerList: "5e0e4168ed21f207087fad9d"
              todoCreatedBy: {_id: "5e0e4088ed21f207087fad8e", friendRequestSent: Array(1), friendRequestReceived: Array(0), friends: Array(1), emailVerified: "Yes", …}
              todoModifiedBy: {_id: "5e0e4088ed21f207087fad8e", friendRequestSent: Array(1), friendRequestReceived: Array(0), friends: Array(1), emailVerified: "Yes", …}
              subtodo: []
              completed: true
              todoModifiedDate: "2020-01-03T16:08:14.000Z"
              todoCreatedDate: "2020-01-02T19:17:28.000Z"
              todoDescription: "myTodo"
              todoName: "main task"
              todoId: "6zBHYyFe"
            }
        }
      */
       app.post(`${baseUrl}/:id/deleteTodo`,auth.isAuthorized,todoController.deleteAllTodoById);
           /**
     * @apiGroup todo
     * @apiVersion  1.0.0
     * @api {post} /api/v1/todo/:id/deleteTodo api to Delete a Todo(which will delete all subtodos under it if exists).
     *
     * @apiParam {string} todoId of the todo to delete. (header params) (required)
     * @apiParam {string} authToken Authentication Token. (body/header/query params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Todo Details Found and Deleted",
            "status": 200,
            "data": {
                    n: 1
                    ok: 1
            }
        }
    */

       app.post(`${baseUrl}/:subTodoId/deletesubTodo`,auth.isAuthorized,todoController.deletesubTodoFunction);
            /**
     * @apiGroup todo
     * @apiVersion  1.0.0
     * @api {post} /api/v1/todo/:subTodoId/deletesubTodo api to Delete a subTodo
     *
     * @apiParam {string} subTodoId of the todo to delete (header params) (required)
     * @apiParam {string} authToken Authentication Token. (body/header/query params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Todo Details Found and Deleted",
            "status": 200,
            "data": {
                    n: 1
                    ok: 1
            }
        }
    */


       app.post(`${baseUrl}/:todoId/updateTodo`,auth.isAuthorized,todoController.updateTodoFunction);
           /**
         * @apiGroup todo
         * @apiVersion  1.0.0
         * @api {post} /api/v1/todo/:todoId/updateTodo api to Update the todo.
         *
         * @apiParam {string} TodoName  Name of the todo to update with. (body params) (required)
         * @apiParam {string} TodoModifiedBy UserId of the todo modifier. (body params) (required)
         * @apiParam {string} authToken Authentication Token. (body/header/query params) (required)
         *
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
            {
                "error": false,
                "message": "Todo found and Updated",
                "status": 200,
                "data": {
                   n: 1
                   nModified: 1
                   ok: 1
                }
            }
    */


       app.post(`${baseUrl}/:subTodoId/updatesubTodo`,auth.isAuthorized,todoController.updatesubTodoFunction);
            /**
         * @apiGroup todo
         * @apiVersion  1.0.0
         * @api {post} /api/v1/todo/:subTodoId/updatesubTodo api to Update the todo.
         *
         * @apiParam {string} subTodoName  Name of the sub todo to update with. (body params) (required)
         * @apiParam {string} TodoModifiedBy UserId of the sub todo modifier. (body params) (required)
         * @apiParam {string} authToken Authentication Token. (body/header/query params) (required)
         *
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
            {
                "error": false,
                "message": "Sub Todo Found and Updated",
                "status": 200,
                "data": {
                   n: 1
                   nModified: 1
                   ok: 1
                }
            }
    */
       

}


    //        /**
    //  * @apiGroup todo
    //  * @apiVersion  1.0.0
    //  * @api {get} /api/v1/todo/:friendId/getFriendTodos api to get all Friends Todos.
    //  *
    //  * @apiParam {string} ListId _id of the List from which all todos need to get. (header params) (required)
    //  * @apiParam {string} pageSize Size of the page. (query params) (required)
    //  * @apiParam {string} pageIndex current Index of page. (query params) (required)
    //  *
    //  * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    //  * 
    //  * @apiSuccessExample {object} Success-Response:
    //     {
    //         "error": false,
    //         "message": "Todos Found and Listed",
    //         "status": 200,
    //         "data": {
    //           __v: 0
    //           _id: "5e0e41c8ed21f207087fada2"
    //           ownerList: "5e0e4168ed21f207087fad9d"
    //           todoCreatedBy: {_id: "5e0e4088ed21f207087fad8e", friendRequestSent: Array(1), friendRequestReceived: Array(0), friends: Array(1), emailVerified: "Yes", …}
    //           todoModifiedBy: {_id: "5e0e4088ed21f207087fad8e", friendRequestSent: Array(1), friendRequestReceived: Array(0), friends: Array(1), emailVerified: "Yes", …}
    //           subtodo: []
    //           completed: true
    //           todoModifiedDate: "2020-01-03T16:08:14.000Z"
    //           todoCreatedDate: "2020-01-02T19:17:28.000Z"
    //           todoDescription: "myTodo"
    //           todoName: "main task"
    //           todoId: "6zBHYyFe"
    //         }
    //     }
    // */
   //  app.get(`${baseUrl}/:friendId/getFriendTodos`, todoController.getAllFriendTodos);
         //  app.post(`${baseUrl}/:id/deleteSubTodo`,auth.isAuthorized,todoController.deleteAllSubTodoById);
