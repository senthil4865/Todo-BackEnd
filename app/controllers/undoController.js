const mongoose = require('mongoose');
const response = require('../libs/responseLib')
const logger = require('../libs/loggerLib');
const check = require('../libs/checkLib')
const shortid = require('shortid');
const async = require('async');
const time = require('../libs/timeLib');

/* Models */
const Undo = require('../models/Undo');
const Todo = require('../models/Todo');
const subTodo=require('../models/subTodo');
const List=require('../models/List');
const ObjectId = require('mongodb').ObjectID;



let addUndoActionFunction = (req, res) => {
    console.log(req.body)

    let validateUserInput = () => {
        return new Promise((resolve, reject) => {
            if (req.body.listId && req.body.action) {
                resolve(req)
            } else {
                logger.error('Field Missing During History Creation', 'undoController:addUndoActionFunction:validateUserInput', 5)
                let apiResponse = response.generate(true, 'One or More Parameter(s) is missing', 400, null)
                reject(apiResponse)
            }
        })
    }

    let findTodo = (req,res) => {
        return new Promise((resolve, reject) => {
            if(req.body.action == 'Todo Add'){
                resolve(null)
            }
            else if(req.body.action == 'Sub Todo Add'){
                resolve(null)
            }
            else if(req.body.action == 'Todo Update') {
                Todo.findOne({ todoId: req.body.todoId })
                .select()
                .lean()
                .exec((err, TodoDetails) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'undoController:addUndoActionFunction:Todo Update', 10)
                        let apiResponse = response.generate(true, 'Failed To Find Todo Details', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(TodoDetails)) {
                        logger.info('No Todo Found', 'undoController:addUndoActionFunction:Todo Update')
                        let apiResponse = response.generate(true, 'No Todo Found', 404, null)
                        reject(apiResponse)
                    } else {
                        let apiResponse = response.generate(false, 'Todo Found', 200, TodoDetails)
                        resolve(TodoDetails)
                    }
                })
            }
            else if(req.body.action == 'Sub Todo Update'){
                subTodo.findOne({ subTodoId: req.body.subTodoId })
                .select()
                .lean()
                .exec((err, subTodoDetails) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'undoController:addUndoActionFunction:Sub Todo Update', 10)
                        let apiResponse = response.generate(true, 'Failed To Find Items', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(subTodoDetails)) {
                        logger.info('No Sub Todo Found', 'addUndoActionFunction:Sub Todo Update')
                        let apiResponse = response.generate(true, 'No Sub Todo Found', 404, null)
                        reject(apiResponse)
                    } else {
                        let apiResponse = response.generate(false, 'Sub Todo Found', 200, subTodoDetails)
                        resolve(subTodoDetails)
                    }
                })
            }   else if(req.body.action == 'Todo Delete'){
              Todo.findOne({ todoId: req.body.todoId })
              .populate("subtodo")
              .select()
              .lean()
              .exec((err, TodoDetails) => {
                  if (err) {
                      console.log(err)
                      logger.error(err.message, 'undoController:addUndoActionFunction:Todo Delete', 10)
                      let apiResponse = response.generate(true, 'Failed To Find Items', 500, null)
                      reject(apiResponse)
                  } else if (check.isEmpty(TodoDetails)) {
                      logger.info('No Todo Found To Delete', 'undoController:addUndoActionFunction:Todo Delete')
                      let apiResponse = response.generate(true, 'No Todo Found To Delete', 404, null)
                      reject(apiResponse)
                  } else {
                      let apiResponse = response.generate(false, 'Todo Found To Delete', 200, TodoDetails)
                      resolve(TodoDetails)
                  }
              })
            }

            else if(req.body.action="Sub Todo Delete"){
              subTodo.findOne({ subTodoId: req.body.subTodoId })
              .select()
              .lean()
              .exec((err, subTodoDetails) => {
                  if (err) {
                      console.log(err)
                      logger.error(err.message, 'undoController:addUndoActionFunction:Sub Todo Delete', 10)
                      let apiResponse = response.generate(true, 'Failed To Find Sub Todo to Delete', 500, null)
                      reject(apiResponse)
                  } else if (check.isEmpty(subTodoDetails)) {
                      logger.info('No Sub Todo fount to delete', 'undoController:addUndoActionFunction:Sub Todo Delete')
                      let apiResponse = response.generate(true, 'No Sub Todos Found to Delete', 404, null)
                      reject(apiResponse)
                  } else {
                      let apiResponse = response.generate(false, 'Sub Todo found to Delete', 200, subTodoDetails)
                      resolve(subTodoDetails)
                  }
              })

            }
        })
    }

    let updateUndo = (TodoDetails) => {
        return new Promise((resolve, reject) => {
            let newUndo = new Undo({
                undoId: shortid.generate(),
                listId: req.body.listId,
                action: req.body.action,
                createdOn: time.now(),
                todoId:req.body.todoId,
                subTodoId:req.body.subTodoId,
                todoValues:TodoDetails,
                subTodoValues:TodoDetails
            })

     console.log(newUndo,'new undo');
            newUndo.save((err, newItem) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'UndoController: addTodo', 10)
                    let apiResponse = response.generate(true, 'Failed to add Undo for Todo', 500, null)
                    reject(apiResponse)
                } else {
                    let newItemObj = newItem.toObject();
                    resolve(newItemObj)
                }
            })

        })
    }


    validateUserInput(req, res)
        .then(findTodo)
        .then(updateUndo)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Undo Added', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })

}

// start deleteHistoryFunction

let deleteUndoActionFunction = (req, res) => {
    let findUndo = () => {
        return new Promise((resolve, reject) => {
            Undo.findOne({ listId: req.body.listId }).sort({ $natural: -1 })
                .select()
                .lean()
                .exec((err, UndoDetails) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'Undo Controller: deleteUndoActionFunction-findUndo', 10)
                        let apiResponse = response.generate(true, 'Failed To Find Undo Details', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(UndoDetails)) {
                        logger.info('No Undo Found', 'Undo Controller: deleteUndoActionFunction-findUndo')
                        let apiResponse = response.generate(true, 'No Undo Found', 404, null)
                        reject(apiResponse)
                    } else {
                        let apiResponse = response.generate(false, 'Undo Found', 200, UndoDetails)
                        resolve(UndoDetails)
                    }
                })
        })
    }

    let removeUndo = (UndoDetails) => {
        return new Promise((resolve, reject) => {

            Undo.findOneAndRemove({ undoId: UndoDetails.undoId }).exec((err, result) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'Undo Controller: deleteUndoActionFunction-removeUndo', 10)
                    let apiResponse = response.generate(true, 'Failed To delete Item', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No Undo Found', 'Undo Controller: deleteUndoActionFunction-removeUnd')
                    let apiResponse = response.generate(true, 'No Undo Found tp Remove', 404, null)
                    reject(apiResponse)
                } else {

                    let apiResponse = response.generate(false, 'Undo Deleted', 200, result)
                    resolve(apiResponse)
                }
            });// end find and remove

        })
    }

    findUndo(req, res)
        .then(removeUndo)
        .then((resolve) => {
            res.send(resolve)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })
}// end deleteUndoFunction 


let getUndosActionFunction = (req, res) => {

    let findUndo = () => {
        return new Promise((resolve, reject) => {
            Undo.findOne({ listId: req.params.listId }).sort({ $natural: -1 })
                .select()
                .lean()
                .exec((err, undoDetails) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'undo Controller: v', 10)
                        let apiResponse = response.generate(true, 'Failed To Find Item Details', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(undoDetails)) {
                        logger.info('No Histoy Found', 'undo  Controller:findundo')
                        let apiResponse = response.generate(true, 'No undo Found', 404, null)
                        reject(apiResponse)
                    } else {
                        let apiResponse = response.generate(false, 'undo Found', 200, undoDetails)
                      console.log(undoDetails,'undodetails');
                        resolve(undoDetails)
                    }
                })
        })
    }// end findUndo

    findUndo(req, res)
        .then((resolve) => {
            //let apiResponse = response.generate(false, 'History Deleted', 200, resolve)
            res.send(resolve)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })

}
let updateTodoUndoFunction=(req,res)=>{
    let findTodoDetails = (req,res) => {
  
        return new Promise((resolve, reject) => {
            Todo.findOne({ todoId: req.body.todoId })
                .select()
                .lean()
                .exec((err, todoDetails) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'Undo Controller: updateTodoUndoFunction-findTodoDetails', 10)
                        let apiResponse = response.generate(true, 'Failed To Find Undo Details', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(todoDetails)) {
                        logger.info('No Undo Found', 'Undo Controller:findTodoDetails')
                        let apiResponse = response.generate(true, 'No List Found', 404, null)
                        reject(apiResponse)
                    } else {
                        let apiResponse = response.generate(false, 'Undo Found', 200, todoDetails)
                        resolve(todoDetails)
                    }
                })
        })
    }// end findListdetails
    
    let updateTodo = (todoDetails) => {
        return new Promise((resolve, reject) => {
         
                let options ={
                 _id:req.body._id,
                 ownerList:req.body.ownerList,
                 todoCreatedBy:req.body.todoCreatedBy,
                 todoModifiedBy:req.body.todoModifiedBy,
                 completed:req.body.completed,
                 todoModifiedDate:req.body.todoModifiedDate,
                 todoCreatedDate:req.body.todoCreatedDate,
                 todoDescription:req.body.todoDescription,
                 todoName:req.body.todoName,
                }                         
            Todo.update({ todoId: req.body.todoId }, options).exec((err, result) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'Undo Controller: updateTodoUndoFunction-updateTodo', 10)
                    let apiResponse = response.generate(true, 'Failed To Update List details', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No Undo Found', 'Undo Controller: updateTodoUndoFunction-updateTodo')
                    let apiResponse = response.generate(true, 'No Undo Found', 404, null)
                    reject(apiResponse)
                } else {
                    let apiResponse = response.generate(false, 'Updated Todo Undo', 200, result)
                    resolve(apiResponse)
                }
            });// end List model update
            });
    }// end updateList function
    
    
        findTodoDetails(req, res)
        .then(updateTodo)
        .then((resolve) => {
            res.send(resolve)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })
}
let updatesubTodoUndoFunction=(req,res)=>{
    let findsubTodoDetails = (req,res) => {
  
        return new Promise((resolve, reject) => {
            subTodo.findOne({ subTodoId: req.body.subTodoId })
                .select()
                .lean()
                .exec((err, subTodoDetails) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'List Controller: findsubTodoDetails', 10)
                        let apiResponse = response.generate(true, 'Failed To Find List Details', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(subTodoDetails)) {
                        logger.info('No List Found', 'List  Controller:findsubTodoDetails')
                        let apiResponse = response.generate(true, 'No List Found', 404, null)
                        reject(apiResponse)
                    } else {
                        let apiResponse = response.generate(false, 'List Details Found', 200, subTodoDetails)
                        resolve(subTodoDetails)
                    }
                })
        })
    }// end findListdetails
    
    let updatesubTodo = (subTodoDetails) => {
        console.log(subTodoDetails,'sub details');
        return new Promise((resolve, reject) => {
         
                let options ={
                 _id:req.body._id,
                 ownerTodo:req.body.ownerTodo,
                 subTodoCreatedBy:req.body.subTodoCreatedBy,
                 subTodoModifiedBy:req.body.subTodoModifiedBy,
                 completed:req.body.completed,
                 subTodoModifiedDate:req.body.subTodoModifiedDate,
                 subTodoCreatedDate:req.body.subTodoCreatedDate,
                 subTodoDescription:req.body.subTodoDescription,
                 subTodoName:req.body.subTodoName,
                }        
                console.log(options,'options from undo update');                     
            subTodo.update({ subTodoId: req.body.subTodoId }, options).exec((err, result) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'List Controller:updateList', 10)
                    let apiResponse = response.generate(true, 'Failed To Update List details', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No List Found', 'List Controller:updateList')
                    let apiResponse = response.generate(true, 'No List Found', 404, null)
                    reject(apiResponse)
                } else {
                            console.log(result,'update result');
                    let apiResponse = response.generate(false, 'List details Updated', 200, result)
                    resolve(apiResponse)
                }
            });// end List model update
            });
    }// end updateList function
    
    
    findsubTodoDetails(req, res)
        .then(updatesubTodo)
        .then((resolve) => {
            //let apiResponse = response.generate(false, 'List Updated', 200, "None")
            res.send(resolve)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })
}

let addTodoUndoFunction=(req,res)=>{


    let validateTodoInput = () => {
        return new Promise((resolve, reject) => {
          if (
            req.body.todoName &&
            req.body.todoCreatedBy &&
            req.body.todoModifiedBy &&
            req.body.ownerList &&
            req.body.completed &&
            req.body.todoModifiedDate &&
            req.body.todoCreatedDate &&
            req.body.todoId
          ) {
            resolve(req);
          } else {
            logger.error(
              "Field Missing During Item Creation",
              "TodoController: addTodoUndoFunction-validateTodoInput",
              5
            );
            let apiResponse = response.generate(
              true,
              "One or More Parameter(s) is missing",
              400,
              null
            );
            reject(apiResponse);
          }
        });
      }; // end validate list input

    let addTodoItem = () => {
        return new Promise((resolve, reject) => {
         List.findOne({_id:req.body.ownerList},(err,list)=>{
           if(err){
             console.log(err);
           }
           else{
     
       let newItem = new Todo({
         _id:req.body._id,
        ownerList:req.body.ownerList,
        todoId: req.body.todoId,
        todoName: req.body.todoName,
        todoDescription: req.body.todoDescription,
        todoCreatedBy: req.body.todoCreatedBy,
        todoModifiedBy: req.body.todoModifiedBy,
        todoCreatedDate: req.body.todoCreatedDate,
        todoModifiedDate: req.body.todoModifiedDate
      });
      
      list.Todos.push(newItem._id);
      list.save((err,result)=>{
        if(err){
          console.log(err,"error creating todo");
        }else{
          console.log(result);
        }
      });
    
      newItem.save((err, newItem) => {
        if (err) {
          console.log(err);
          logger.error(err.message, "TodoController: addTodoUndoFunction-addTodoItem", 10);
          let apiResponse = response.generate(
            true,
            "Failed to add new Todo Item",
            500,
            null
          );
          reject(apiResponse);
        } else {
          let newItemObj = newItem.toObject();
          resolve(newItemObj);
        }
      });
           }
         });
        });
  

}

validateTodoInput(req, res)
.then(addTodoItem)

.then(resolve => {
  let apiResponse = response.generate(
    false,
    "Todo Item Created",
    200,
    resolve
  );
  res.send(apiResponse);
})
.catch(err => {
  console.log(err);
  res.send(err);
});

}
let addsubTodoUndoFunction=(req,res)=>{
    let validateTodoInput = () => {
        return new Promise((resolve, reject) => {
          if (
            req.body.ownerTodo &&
            req.body.subTodoName &&
            req.body.subTodoCreatedBy &&
            req.body.subTodoModifiedBy &&
            req.body.subTodoModifiedDate &&
            req.body.subTodoCreatedDate &&
            req.body.completed 
          ) {
            resolve(req);
          } else {
            logger.error(
              "Field Missing During Item Creation",
              "TodoController: addsubTodoUndoFunction-validateTodoInput",
              5
            );
            let apiResponse = response.generate(
              true,
              "One or More Parameter(s) is missing",
              400,
              null
            );
            reject(apiResponse);
          }
        });
      }; // end validate list input


      let addSubTodoItem = () => {
        return new Promise((resolve, reject) => {
                  Todo.findOne({ _id: req.body.ownerTodo }, function(err, todo) {
                    if (err) {
                        console.log(err);
                    } else {
                      let newItem = new subTodo({
                        _id:req.body._id,
                        subTodoId: req.body.subTodoId,
                        subTodoName: req.body.subTodoName,
                        subTodoDescription: req.body.subTodoDescription
                          ? req.body.subTodoDescription
                          : " ",
                        subTodoCreatedBy: req.body.subTodoCreatedBy,
                        subTodoModifiedBy: req.body.subTodoModifiedBy,
                        completed: req.body.completed,
                        subTodoModifiedDate: req.body.subTodoModifiedDate,
                        subTodoCreatedDate: req.body.subTodoCreatedDate,

                      });
                      newItem.ownerTodo = req.body.ownerTodo;
                      console.log(newItem, "new item");
                      console.log(todo, "todo");
                      // Add the category to the user's `categories` array.
                      todo.subtodo.push(newItem._id);
    
                      todo.save((err, result) => {
                        if (err) {
                          console.log(err, "from todo save");
                        }else{
                            console.log(result);
                        }
                      });
    
    
                      newItem.save((err, newItem) => {
                        if (err) {
                          console.log(err);
                          logger.error(err.message, "TodoController: addsubTodoUndoFunction-addSubTodoItem", 10);
                          let apiResponse = response.generate(
                            true,
                            "Failed to add new  Sub Todo Item",
                            500,
                            null
                          );
                          reject(apiResponse);
                        } else {
                          let newItemObj = newItem.toObject();
                          resolve(newItemObj);
                        }
                      });
    
    
                    }
                  });

        });
      }; // end addItem function
    
      validateTodoInput(req, res)
        .then(addSubTodoItem)
        .then(resolve => {
            console.log(resolve);
          let apiResponse = response.generate(
            false,
            "Sub Todo Item Created",
            200,
            resolve
          );
          res.send(apiResponse);
        })
        .catch(err => {
          console.log(err);
          res.send(err);
        });
}

module.exports = {
    addUndoActionFunction: addUndoActionFunction,
    deleteUndoActionFunction: deleteUndoActionFunction,
    getUndosActionFunction: getUndosActionFunction,
    updateTodoUndoFunction:updateTodoUndoFunction,
    updatesubTodoUndoFunction:updatesubTodoUndoFunction,
    addTodoUndoFunction:addTodoUndoFunction,
    addsubTodoUndoFunction:addsubTodoUndoFunction
}// end exports