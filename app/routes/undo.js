const express = require('express');
const router = express.Router();
const todoController = require("./../../app/controllers/todoController");
const appConfig = require("./../../config/appConfig");
const auth = require('./../middlewares/auth');
const undoController=require('../controllers/undoController');


module.exports.setRouter=(app)=>{
     let baseUrl = `${appConfig.apiVersion}/undo`;
 
       app.post(`${baseUrl}/addUndo`,undoController.addUndoActionFunction);
             /**
           * @apiGroup undo
           * @apiVersion  1.0.0
           * @api {post} /api/v1/undo/addUndo api to Add Undo.
           *
           * @apiParam {string} authToken Authentication Token. (body/header/query params) (required)
           * @apiParam {string} listId _id of the List. (body params) (required)
           * @apiParam {string} action Action to perform. (body params) (required)
           * @apiParam {string} todoId todoId of the todo to add to undo. (body params) (required)
           *  @apiParam {string} subTodoId subTodoId of the todo to add to undo. (body params) (required)
           *
           * @apiSuccess {object} myResponse shows error status, message, http status code, result.
           * 
           * @apiSuccessExample {object} Success-Response:
              { 
                  "error": false,
                  "message": "Undo Added",
                  "status": 200,
                  "data": {
                  _id:5e0e416eed21f207087fad9f
                  subTodoValues:null
                  todoValues:null
                  actionCreated:2020-01-02T19:10:04.506+00:00
                  action:"Todo Add"
                  subTodoId:"undefined"
                  todoId:"9KT648Yo"
                  listId:"5e0e4168ed21f207087fad9d"
                  undoId:"zxbHd80Tt"
                  }
              }    
          */
       app.post(`${baseUrl}/deleteUndo`, auth.isAuthorized, undoController.deleteUndoActionFunction);
              /**
           * @apiGroup undo
           * @apiVersion  1.0.0
           * @api {post} /api/v1/undo/deleteUndo api to Delete Undo.
           *
           * @apiParam {string} authToken Authentication Token. (body/header/query params) (required)
           * @apiParam {string} listId ListId under which to perform undo. (body params) (required)
           *
           * @apiSuccess {object} myResponse shows error status, message, http status code, result.
           * 
           * @apiSuccessExample {object} Success-Response:
              { 
                  "error": false,
                  "message": "Undo Deleted",
                  "status": 200,
                  "data": {
                   _id: "5e0f669a137bc448acfb8ab6"
                  __v: 0
                  subTodoValues: null
                  todoValues: null
                  actionCreated: "2020-01-03T15:40:16.664Z"
                  action: "Sub Todo Add"
                  subTodoId: "1VYXNikb"
                  todoId: "undefined"
                  listId: "5e0e4168ed21f207087fad9d"
                  undoId: "dJkLI0Jbj"
                  }
              }    
          */

       app.post(`${baseUrl}/updateTodoUndo`, undoController.updateTodoUndoFunction);
          /**
           * @apiGroup undo
           * @apiVersion  1.0.0
           * @api {post} /api/v1/undo/updateTodoUndo api to Update Todo for undo operation.
           *
           * @apiParam {string} authToken Authentication Token. (body/header/query params) (required)
           * @apiParam {string}  _id _id of the todo to update undo. (body params) (required)
           * @apiParam {string}  ownerList _id of the parent to whhich todo belongs to. (body params) (required)
           * @apiParam {string}  todoCreatedBy _id of the todo creator. (body params) (required)
           * @apiParam {string}  todoModifiedBy _id of the todo modifier. (body params) (required)
           * @apiParam {string}  completed complete status of the todo to update undo. (body params) (required)
           * @apiParam {string}  todoModifiedDate Date at which todo is created. (body params) (required)
           * @apiParam {string}  todoCreatedDate Date at which todo is created. (body params) (required)
           * @apiParam {string}  todoDescription Description for the todo. (body params) (required)
           * @apiParam {string}  todoName Name of the todo. (body params) (required)
           * @apiParam {string}  todoId todoId of the todo. (body params) (required)
           *
           * @apiSuccess {object} myResponse shows error status, message, http status code, result.
           * 
           * @apiSuccessExample {object} Success-Response:
              { 
                  "error": false,
                  "message": "Updated Todo Undo",
                  "status": 200,
                  "data": {
                  _id: "5e0f669a137bc448acfb8ab6"
                  __v: 0
                  subTodoValues: [{_id:5e0f669a137bcwf221fcwq6...}]
                  todoValues: [{_id:5e0f669a137bcwf221fcwq6...}]
                  actionCreated: "2020-01-03T15:40:16.664Z"
                  action: "Todo Update"
                  subTodoId: "1VYXNikb"
                  todoId: "undefined"
                  listId: "5e0e4168ed21f207087fad9d"
                  undoId: "dJkLI0Jbj"
                  }
              }    
           */



       app.post(`${baseUrl}/updatesubTodoUndo`, undoController.updatesubTodoUndoFunction);

            /**
           * @apiGroup undo
           * @apiVersion  1.0.0
           * @api {post} /api/v1/undo/updatesubTodoUndo api to Update Sub Todo for undo operation.
           *
           * @apiParam {string} authToken Authentication Token. (body/header/query params) (required)
           * @apiParam {string}  _id _id of the todo to update undo. (body params) (required)
           * @apiParam {string}  ownerTodo _id of the parent todo to which sub todo belongs to. (body params) (required)
           * @apiParam {string}  subTodoCreatedBy _id of the sub todo creator. (body params) (required)
           * @apiParam {string}  subTodoModifiedBy _id of the sub todo modifier. (body params) (required)
           * @apiParam {string}  completed complete status of the sub todo to update undo. (body params) (required)
           * @apiParam {string}  subTodoModifiedDate Date at which sub todo is created. (body params) (required)
           * @apiParam {string}  subTodoCreatedDate Date at which sub todo is created. (body params) (required)
           * @apiParam {string}  subTodoDescription Description for the sub todo (body params) (required)
           * @apiParam {string}  subTodoName Name of the sub todo. (body params) (required)
           * @apiParam {string}  subTodoId todoId of the sub todo. (body params) (required)
           *
           * @apiSuccess {object} myResponse shows error status, message, http status code, result.
           * 
           * @apiSuccessExample {object} Success-Response:
              { 
                  "error": false,
                  "message": "Sub Todo Found and Updated",
                  "status": 200,
                  "data": {
                  _id: "5e0f669a137bc448acfb8ab6"
                  __v: 0
                  subTodoValues: [{_id:5e0f669a137bcwf221fcwq6...}]
                  todoValues: [{_id:5e0f669a137bcwf221fcwq6...}]
                  actionCreated: "2020-01-03T15:40:16.664Z"
                  action: "Todo Add"
                  subTodoId: "1VYXNikb"
                  todoId: "undefined"
                  listId: "5e0e4168ed21f207087fad9d"
                  undoId: "dJkLI0Jbj"
                  }
              }    
          */
       app.post(`${baseUrl}/addTodoUndo`, undoController.addTodoUndoFunction);
              /**
           * @apiGroup undo
           * @apiVersion  1.0.0
           * @api {post} /api/v1/undo/addTodoUndo api to Add todo for undo operation.
           *
           * @apiParam {string} authToken Authentication Token. (body/header/query params) (required)
           * @apiParam {string}  _id _id of the todo to update undo. (body params) (required)
           * @apiParam {string}  ownerList _id of the parent to whhich todo belongs to . (body params) (required)
           * @apiParam {string}  todoCreatedBy _id of the todo creator. (body params) (required)
           * @apiParam {string}  todoModifiedBy _id of the todo modifier. (body params) (required)
           * @apiParam {string}  completed complete status of the todo to update undo. (body params) (required)
           * @apiParam {string}  todoModifiedDate Date at which todo is created. (body params) (required)
           * @apiParam {string}  todoCreatedDate Date at which todo is created. (body params) (required)
           * @apiParam {string}  todoDescription Description for the todo (body params) (required)
           * @apiParam {string}  todoName Name of the todo. (body params) (required)
           * @apiParam {string}  todoId todoId of the todo. (body params) (required)
           *
           * @apiSuccess {object} myResponse shows error status, message, http status code, result.
           * 
           * @apiSuccessExample {object} Success-Response:
              { 
                  "error": false,
                  "message": "Todo Item Created",
                  "status": 200,
                  "data": {
                  _id: "5e0f669a137bc448acfb8ab6"
                  __v: 0
                  subTodoValues: [{_id:5e0f669a137bcwf221fcwq6...}]
                  todoValues: [{_id:5e0f669a137bcwf221fcwq6...}]
                  actionCreated: "2020-01-03T15:40:16.664Z"
                  action: "Todo Add"
                  subTodoId: "1VYXNikb"
                  todoId: "undefined"
                  listId: "5e0e4168ed21f207087fad9d"
                  undoId: "dJkLI0Jbj"
                  }
              }    
          */

       app.post(`${baseUrl}/addsubTodoUndo`, undoController.addsubTodoUndoFunction);
              /**
           * @apiGroup undo
           * @apiVersion  1.0.0
           * @api {post} /api/v1/undo/addsubTodoUndo api to Add Sub Todo for undo operation.
           *
           * @apiParam {string} authToken Authentication Token. (body/header/query params) (required)
           * @apiParam {string}  _id _id of the todo to update undo. (body params) (required)
           * @apiParam {string}  ownerTodo _id of the parent todo to which sub todo belongs to . (body params) (required)
           * @apiParam {string}  subTodoCreatedBy _id of the sub todo creator. (body params) (required)
           * @apiParam {string}  subTodoModifiedBy _id of the sub todo modifier. (body params) (required)
           * @apiParam {string}  completed complete status of the sub todo to update undo. (body params) (required)
           * @apiParam {string}  subTodoModifiedDate Date at which sub todo is created. (body params) (required)
           * @apiParam {string}  subTodoCreatedDate Date at which sub todo is created. (body params) (required)
           * @apiParam {string}  subTodoDescription Description for the sub todo (body params) (required)
           * @apiParam {string}  subTodoName Name of the sub todo. (body params) (required)
           * @apiParam {string}  subTodoId todoId of the sub todo. (body params) (required)
           *
           * @apiSuccess {object} myResponse shows error status, message, http status code, result.
           * 
           * @apiSuccessExample {object} Success-Response:
              { 
                  "error": false,
                  "message": ""Sub Todo Item Created",
                  "status": 200,
                  "data": {
                  _id: "5e0f669a137bc448acfb8ab6"
                  __v: 0
                  subTodoValues: [{_id:5e0f669a137bcwf221fcwq6...}]
                  todoValues: [{_id:5e0f669a137bcwf221fcwq6...}]
                  actionCreated: "2020-01-03T15:40:16.664Z"
                  action: "Todo Add"
                  subTodoId: "1VYXNikb"
                  todoId: "undefined"
                  listId: "5e0e4168ed21f207087fad9d"
                  undoId: "dJkLI0Jbj"
                  }
              }    
          */
}




