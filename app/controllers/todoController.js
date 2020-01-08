const shortid = require("shortid");
const time = require("./../libs/timeLib");
const response = require("./../libs/responseLib");
const logger = require("./../libs/loggerLib");
const check = require("../libs/checkLib");
const User = require("../models/User");
const Todo = require("../models/Todo");
const subTodo = require("../models/subTodo");
const List = require("../models/List");
const ObjectId = require("mongodb").ObjectID;

let addTodoFunction = (req, res) => {
  let validateTodoInput = () => {
    return new Promise((resolve, reject) => {
      if (
        req.body.todoName &&
        req.body.todoCreatedBy &&
        req.body.todoModifiedBy
      ) {
        resolve(req);
      } else {
        logger.error(
          "Field Missing During Todo Creation",
          "TodoController: addTodoFunction()",
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
  }; 

  let findUserDetails = value => {
    return new Promise((resolve, reject) => {
      User.findOne({ userId: value })
        .select("_id")
        .lean()
        .exec((err, userDetails) => {
          if (err) {
            console.log(err);
            logger.error(
              err.message,
              "Todo Controller: addTodoFunction-findUserDetails",
              10
            );
            let apiResponse = response.generate(
              true,
              "Failed To Find Todo Details",
              500,
              null
            );
            reject(apiResponse);
          } else if (check.isEmpty(userDetails)) {
            logger.info(
              "No Todo Found",
              "Todo  Controller:addTodoFunction-findUserDetails"
            );
            let apiResponse = response.generate(
              true,
              "No User Found",
              404,
              null
            );
            reject(apiResponse);
          } else {
            let apiResponse = response.generate(
              false,
              "User Details Found",
              200,
              userDetails
            );
            resolve(userDetails);
          }
        });
    });
  }; 

  let addTodoItem = () => {
    return new Promise((resolve, reject) => {
      let todoCreatedById;
      let todoModifiedById;

      findUserDetails(req.body.todoCreatedBy)
        .then(id => {
          todoCreatedById = id._id;
        })
        .then(() => {
          findUserDetails(req.body.todoModifiedBy)
            .then(id => {
              todoModifiedById = id._id;
            })
            .then(() => {
              List.findOne({ _id: req.body.ownerList }, (err, list) => {
                if (err) {
                  console.log(err);
                } else {
                  let newItem = new Todo({
                    ownerList: req.body.ownerList,
                    todoId: shortid.generate(),
                    todoName: req.body.todoName,
                    todoDescription: req.body.todoDescription,
                    todoCreatedBy: todoCreatedById,
                    todoModifiedBy: todoModifiedById,
                    todoCreatedDate: time.now(),
                    todoModifiedDate: time.now()
                  });

                  list.Todos.push(newItem._id);
                  list.save((err, result) => {
                    if (err) {
                      console.log(err, "error to save Todo id in list");
                    } else {
                      console.log(result);
                    }
                  });
                  newItem.save((err, newItem) => {
                    if (err) {
                      console.log(err);
                      logger.error(
                        err.message,
                        "TodoController: addTodoItem",
                        10
                      );
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
        });
    });
  }; 

  validateTodoInput(req, res)
    .then(addTodoItem)

    .then(resolve => {
      let apiResponse = response.generate(
        false,
        "Todo Created",
        200,
        resolve
      );
      res.send(apiResponse);
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
};

let getAllTodosFunction = (req, res) => {
  let findItems = (req, res) => {
    return new Promise((resolve, reject) => {
      Todo.find({ ownerList: ObjectId(req.params.id) }).count((err, result) => {
        if (err) {
          console.log(err);
          logger.error(err.message, "TodoController: getAllTodo", 10);
          let apiResponse = response.generate(
            true,
            "Failed To Find Todo Details",
            500,
            null
          );
          res.send(apiResponse);
        } else if (check.isEmpty(result)) {
          logger.info("No Todo Found", "TodoController: getAllTodo");
          let apiResponse = response.generate(true, "No Todo Found", 404, null);
          res.send(apiResponse);
        } else {
          let count = result;
          let pageNumber = parseInt(req.query.pageIndex);
          let nPerPage = parseInt(req.query.pageSize);
          Todo.find({ ownerList: ObjectId(req.params.id) })
            .select()
            .skip(pageNumber > 0 ? pageNumber * nPerPage : 0)
            .limit(nPerPage)
            .populate("subtodo")
            .populate("todoCreatedBy")
            .populate("todoModifiedBy")
            .lean()
            .exec((err, ItemDetails) => {
              if (err) {
                console.log(err);
                logger.error(err.message, "Item Controller: findTodo", 10);
                let apiResponse = response.generate(
                  true,
                  "Failed To Find Todo Items",
                  500,
                  null
                );
                reject(apiResponse);
              } else if (check.isEmpty(ItemDetails)) {
                logger.info("No Item Found", "Todo  Controller:findTodo");
                let apiResponse = response.generate(
                  true,
                  "No Todo Item Found",
                  404,
                  null
                );
                reject(apiResponse);
              } else {
                let apiResponse = response.generate(
                  false,
                  "Todos Found and Listed",
                  200,
                  ItemDetails
                );
                apiResponse.count = count;
                resolve(apiResponse);
              }
            });
        }
      });
    });
  };

  findItems(req, res)
    .then(resolve => {
      res.send(resolve);
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
};

let addSubTodoFunction = (req, res) => {
  let validateTodoInput = () => {
    return new Promise((resolve, reject) => {
      if (
        req.body.ownerTodo &&
        req.body.subTodoName &&
        req.body.subTodoCreatedBy &&
        req.body.subTodoModifiedBy
      ) {
        resolve(req);
      } else {
        logger.error(
          "Field Missing During Item Creation",
          "TodoController: addSubTodoFunction()",
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
  }; 

  let findUserDetails = value => {
    return new Promise((resolve, reject) => {
      User.findOne({ userId: value })
        .select("_id")
        .lean()
        .exec((err, userDetails) => {
          if (err) {
            console.log(err);
            logger.error(err.message, "Todo Controller: finduserDetails", 10);
            let apiResponse = response.generate(
              true,
              "Failed To Find User Details",
              500,
              null
            );
            reject(apiResponse);
          } else if (check.isEmpty(userDetails)) {
            logger.info("No User Found", "Todo  Controller:finduserDetails");
            let apiResponse = response.generate(
              true,
              "No User Found",
              404,
              null
            );
            reject(apiResponse);
          } else {
            let apiResponse = response.generate(
              false,
              "User Details Found",
              200,
              userDetails
            );
            resolve(userDetails);
          }
        });
    });
  }; 

  let addSubTodo = () => {
    return new Promise((resolve, reject) => {
      let subtodoCreatedById;
      let subtodoModifiedById;

      findUserDetails(req.body.subTodoCreatedBy)
        .then(id => {
          subtodoCreatedById = id._id;
        })
        .then(() => {
          findUserDetails(req.body.subTodoModifiedBy)
            .then(id => {
              subtodoModifiedById = id._id;
            })
            .then(() => {


              Todo.findOne({ _id: req.body.ownerTodo }, function(err, todo) {
                if (err) {
                  console.log(err);
                } else {
                  let newItem = new subTodo({
                    subTodoId: shortid.generate(),
                    subTodoName: req.body.subTodoName,
                    subTodoDescription: req.body.subTodoDescription
                      ? req.body.subTodoDescription
                      : " ",
                    subTodoCreatedBy: subtodoCreatedById,
                    subTodoModifiedBy: subtodoModifiedById,
                    subTodoCreatedDate: time.now(),
                    subTodoModifiedDate: time.now()
                  });
                  newItem.ownerTodo = req.body.ownerTodo;
                  todo.subtodo.push(newItem._id);

                  todo.save((err, result) => {
                    if (err) {
                      console.log(err, "from todo save");
                    } else {
                      console.log(result);
                    }
                  });

                  newItem.save((err, newItem) => {
                    if (err) {
                      console.log(err);
                      logger.error(
                        err.message,
                        "TodoController: addSubTodo",
                        10
                      );
                      let apiResponse = response.generate(
                        true,
                        "Failed to add new sub Todo",
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
        });
    });
  };

  validateTodoInput(req, res)
    .then(addSubTodo)

    .then(resolve => {
      console.log(resolve);
      let apiResponse = response.generate(
        false,
        "Sub Todo Created",
        200,
        resolve
      );
      res.send(apiResponse);
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
};

let changeStateFunction = (req, res) => {
  let validateTodoInput = () => {
    return new Promise((resolve, reject) => {
      if (req.body.todoId && req.body.checkedState) {
        resolve(req);
      } else {
        logger.error(
          "Field Missing During Item Creation",
          "TodoController: changeStateFunction()",
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
  }; 

  let findTodoDetails = value => {
    return new Promise((resolve, reject) => {
      Todo.findOne({ todoId: value })
        .lean()
        .exec((err, todoDetails) => {
          if (err) {
            console.log(err);
            logger.error(err.message, "Todo Controller: findTodoDetails", 10);
            let apiResponse = response.generate(
              true,
              "Failed To Find Todo Details",
              500,
              null
            );
            reject(apiResponse);
          } else if (check.isEmpty(todoDetails)) {
            logger.info("No Todo Found", "Todo  Controller:findTodoDetails");
            let apiResponse = response.generate(
              true,
              "No Todo Found",
              404,
              null
            );
            reject(apiResponse);
          } else {
            let apiResponse = response.generate(
              false,
              "Todo Details Found",
              200,
              todoDetails
            );
            resolve(todoDetails);
          }
        });
    });
  }; 

  let changeCheckedState = () => {
    return new Promise((resolve, reject) => {
      findTodoDetails(req.body.todoId).then(todo => {
        let options = {};
        options.completed = req.body.checkedState;
        Todo.update({ todoId: todo.todoId }, options).exec((err, result) => {
          if (err) {
            console.log(err);
            logger.error(err.message, "Todo Controller:updateItem", 10);
            let apiResponse = response.generate(
              true,
              "Failed To Update Item details",
              500,
              null
            );
            reject(apiResponse);
          } else {
            let apiResponse = response.generate(
              false,
              "Todo Details Updated",
              200,
              result
            );
            resolve(apiResponse);
          }
        }); 
      });
    });
  }; 

  validateTodoInput(req, res)
    .then(changeCheckedState)

    .then(resolve => {
      console.log(resolve);
      let apiResponse = response.generate(
        false,
        "Todo Checked State Updated",
        200,
        resolve
      );
      res.send(apiResponse);
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
};

let changeStatesubTodoFunction = (req, res) => {
  let validateTodoInput = () => {
    return new Promise((resolve, reject) => {
      if (req.body.subTodoId && req.body.checkedState) {
        resolve(req);
      } else {
        logger.error(
          "Field Missing During Item Creation",
          "TodoController: changeStatesubTodoFunction()",
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
  };

  let findTodoDetails = value => {
    return new Promise((resolve, reject) => {
      subTodo
        .findOne({ subTodoId: value })
        .lean()
        .exec((err, todoDetails) => {
          if (err) {
            console.log(err);
            logger.error(err.message, "Todo Controller: findTodoDetails", 10);
            let apiResponse = response.generate(
              true,
              "Failed To Find Todo Details",
              500,
              null
            );
            reject(apiResponse);
          } else if (check.isEmpty(todoDetails)) {
            logger.info("No Todo Found", "Todo  Controller:findTodoDetails");
            let apiResponse = response.generate(
              true,
              "No Todo Found",
              404,
              null
            );
            reject(apiResponse);
          } else {
            let apiResponse = response.generate(
              false,
              "Todo Details Found",
              200,
              todoDetails
            );
            resolve(todoDetails);
          }
        });
    });
  }; 

  let changeCheckedStatesubTodo = () => {
    return new Promise((resolve, reject) => {
      findTodoDetails(req.body.subTodoId).then(todo => {
        let options = {};
        options.completed = req.body.checkedState;
        subTodo
          .update({ subTodoId: todo.subTodoId }, options)
          .exec((err, result) => {
            if (err) {
              console.log(err);
              logger.error(err.message, "Todo Controller:changeCheckedStatesubTodo()", 10);
              let apiResponse = response.generate(
                true,
                "Failed To Update sub Todo Checked State",
                500,
                null
              );
              reject(apiResponse);
            } else {
              let apiResponse = response.generate(
                false,
                "sub Todo Checked State Updated",
                200,
                result
              );
              resolve(apiResponse);
            }
          }); 
      });
    });
  }; 

  validateTodoInput(req, res)
    .then(changeCheckedStatesubTodo)
    .then(resolve => {
      console.log(resolve);
      let apiResponse = response.generate(
        false,
        "sub Todo Checked State Updated",
        200,
        resolve
      );
      res.send(apiResponse);
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
};

let getTodoDetails = (req, res) => {
  Todo.find({ todoId: req.params.id })
    .select()
    .populate("subtodo")
    .populate("todoCreatedBy")
    .populate("todoModifiedBy")
    .lean()
    .exec((err, todoDetails) => {
      if (err) {
        console.log(err);
        logger.error(err.message, "Todo Controller: getTodoDetails()", 10);
        let apiResponse = response.generate(
          true,
          "Failed To Find Todo Details",
          500,
          null
        );
        reject(apiResponse);
      } else {
        let apiResponse = response.generate(
          false,
          "Todo Details Found",
          200,
          todoDetails
        );
        res.send(todoDetails);
      }
    });
};

let getAllTodosByListId = (req, res) => {
  let findListDetails = (req, res) => {
    return new Promise((resolve, reject) => {
      List.findOne({ ListId: req.params.listId })
        .select()
        .lean()
        .exec((err, ListDetails) => {
          if (err) {
            console.log(err);
            logger.error(err.message, "Todo Controller: getAllTodosByListId-findListDetails", 10);
            let apiResponse = response.generate(
              true,
              "Failed To Find List Details",
              500,
              null
            );
            reject(apiResponse);
          } else if (check.isEmpty(ListDetails)) {
            logger.info("No List Found", "Todo  Controller:getAllTodosByListId-findListDetails");
            let apiResponse = response.generate(
              true,
              "No List Found",
              404,
              null
            );
            reject(apiResponse);
          } else {
            let apiResponse = response.generate(
              false,
              "List Details Found",
              200,
              ListDetails
            );
            resolve(ListDetails);
          }
        });
    });
  };

  let getTodoById = ListDetails => {
    return new Promise((resolve, reject) => {
      Todo.find({ ownerList: ListDetails._id })
        .select()
        .lean()
        .exec((err, ListDetails) => {
          if (err) {
            console.log(err);
            logger.error(err.message, "Todo Controller: getAllTodosByListId-getTodoById", 10);
            let apiResponse = response.generate(
              true,
              "Failed To Find Todo Details",
              500,
              null
            );
            reject(apiResponse);
          } else if (check.isEmpty(ListDetails)) {
            logger.info("No Todo Found", "Todo Controller: getAllTodosByListId-getTodoById");
            let apiResponse = response.generate(
              true,
              "No Todo Found",
              404,
              null
            );
            reject(apiResponse);
          } else {
            let apiResponse = response.generate(
              false,
              "Todo Details Found",
              200,
              ListDetails
            );
            resolve(ListDetails);
          }
        });
    });
  };

  findListDetails(req, res)
    .then(getTodoById)
    .then(resolve => {
      console.log(resolve);
      let apiResponse = response.generate(
        false,
        "Todo Details Found",
        200,
        resolve
      );
      res.send(apiResponse);
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
};

let deleteAllTodoById = (req, res) => {
  let findTodoDetails = (req, res) => {
    return new Promise((resolve, reject) => {
      Todo.findOne({ todoId: req.params.id })
        .select()
        .lean()
        .exec((err, todoDetails) => {
          if (err) {
            console.log(err);
            logger.error(err.message, "Todo Controller:deleteAllTodoById-findTodoDetails", 10);
            let apiResponse = response.generate(
              true,
              "Failed To Find Todo Details",
              500,
              null
            );
            reject(apiResponse);
          } else if (check.isEmpty(todoDetails)) {
            logger.info("No Todo Found", "Todo  Controller:deleteAllTodoById-findTodoDetails");
            let apiResponse = response.generate(
              true,
              "No Todo Found",
              404,
              null
            );
            reject(apiResponse);
          } else {
            let apiResponse = response.generate(
              false,
              "Todo Details Found",
              200,
              todoDetails
            );
            resolve(todoDetails);
          }
        });
    });
  };

  let deletesubTodoById = todoDetails => {
    return new Promise((resolve, reject) => {
      subTodo
        .deleteMany({ ownerTodo: todoDetails._id })
        .select()
        .lean()
        .exec((err, subTodoDetails) => {
          if (err) {
            console.log(err);
            logger.error(err.message, "Todo Controller: deleteAllTodoById-deletesubTodoById", 10);
            let apiResponse = response.generate(
              true,
              "Failed To delete sub Todos",
              500,
              null
            );
            reject(apiResponse);
          } else if (check.isEmpty(subTodoDetails)) {
            logger.info("No List Found", "Todo  Controller:deleteAllTodoById-deletesubTodoById");
            let apiResponse = response.generate(
              true,
              "No sub Todos Found to Delete",
              404,
              null
            );
            reject(apiResponse);
          } else {
            let apiResponse = response.generate(
              false,
              "All SubTodos under main Todo Deleted",
              200,
              subTodoDetails
            );
            resolve(subTodoDetails);
          }
        });
    });
  };

  let deleteTodoById = subTodoDetails => {
    return new Promise((resolve, reject) => {
      Todo.deleteMany({ todoId: req.params.id })
        .select()
        .lean()
        .exec((err, todoDetails) => {
          if (err) {
            console.log(err);
            logger.error(err.message, "Todo Controller: deleteAllTodoById-deleteTodoById", 10);
            let apiResponse = response.generate(
              true,
              "Failed To Find Todo Details to Delete",
              500,
              null
            );
            reject(apiResponse);
          } else if (check.isEmpty(todoDetails)) {
            logger.info("No List Found", "Todo  Controller:deleteAllTodoById-deleteTodoById");
            let apiResponse = response.generate(
              true,
              "No Todo Details Found to Delete",
              404,
              null
            );
            reject(apiResponse);
          } else {
            let apiResponse = response.generate(
              false,
              "Todo Details Found and Deleted",
              200,
              todoDetails
            );
            resolve(todoDetails);
          }
        });
    });
  };

  findTodoDetails(req, res)
    .then(deletesubTodoById)
    .then(deleteTodoById)
    .then(resolve => {
      console.log(resolve);
      let apiResponse = response.generate(
        false,
        "Todo Details Found and Deleted",
        200,
        resolve
      );
      res.send(apiResponse);
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
};

let updateTodoFunction = (req, res) => {
  let findUserDetails = value => {
    return new Promise((resolve, reject) => {
      User.findOne({ userId: value })
        .select("_id")
        .lean()
        .exec((err, userDetails) => {
          if (err) {
            console.log(err);
            logger.error(err.message, "Todo Controller: updateTodoFunction-findUserDetails", 10);
            let apiResponse = response.generate(
              true,
              "Failed To Find User Details",
              500,
              null
            );
            reject(apiResponse);
          } else if (check.isEmpty(userDetails)) {
            logger.info("No Todo Found", "Todo Controller: updateTodoFunction-findUserDetails");
            let apiResponse = response.generate(
              true,
              "No User Found",
              404,
              null
            );
            reject(apiResponse);
          } else {
            let apiResponse = response.generate(
              false,
              "User Details Found",
              200,
              userDetails
            );
            resolve(userDetails);
          }
        });
    });
  };

  let findTodoDetails = (req, res) => {
    return new Promise((resolve, reject) => {
      Todo.findOne({ todoId: req.params.todoId })
        .select()
        .lean()
        .exec((err, todoDetails) => {
          if (err) {
            console.log(err);
            logger.error(err.message, "Todo Controller: updateTodoFunction-findtodoDetails", 10);
            let apiResponse = response.generate(
              true,
              "Failed To Find Todo Details to update",
              500,
              null
            );
            reject(apiResponse);
          } else if (check.isEmpty(todoDetails)) {
            logger.info("No Todo Found", "Todo  Controller:updateTodoFunction-findtodoDetails");
            let apiResponse = response.generate(
              true,
              "No Todo Found to Update",
              404,
              null
            );
            reject(apiResponse);
          } else {
            let apiResponse = response.generate(
              false,
              "Todo Details Found",
              200,
              todoDetails
            );
            resolve(todoDetails);
          }
        });
    });
  }; 
  let updateTodo = todoDetails => {
    return new Promise((resolve, reject) => {
      let TodoModifiedById;
      findUserDetails(req.body.TodoModifiedBy)
        .then(id => {
          TodoModifiedById = id._id;
        })
        .then(() => {
          let options = {
            todoName: req.body.TodoName,
            todoModifiedBy: TodoModifiedById,
            todoModifiedDate: time.now()
          };
          Todo.update({ todoId: req.params.todoId }, options).exec(
            (err, result) => {
              if (err) {
                console.log(err);
                logger.error(err.message, "updateTodoFunction-updateTodo", 10);
                let apiResponse = response.generate(
                  true,
                  "Failed To Update Todo",
                  500,
                  null
                );
                reject(apiResponse);
              } else if (check.isEmpty(result)) {
                logger.info("No List Found", "updateTodoFunction-updateTodo");
                let apiResponse = response.generate(
                  true,
                  "No Todo Found to Update",
                  404,
                  null
                );
                reject(apiResponse);
              } else {
                let apiResponse = response.generate(
                  false,
                  "Todo found and Updated",
                  200,
                  result
                );
                resolve(apiResponse);
              }
            }
          ); 
        });
    });
  };

  findTodoDetails(req, res)
    .then(updateTodo)
    .then(resolve => {
      res.send(resolve);
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
};

let updatesubTodoFunction = (req, res) => {
  let findUserDetails = value => {
    return new Promise((resolve, reject) => {
      User.findOne({ userId: value })
        .select("_id")
        .lean()
        .exec((err, userDetails) => {
          if (err) {
            console.log(err);
            logger.error(err.message, "Todo Controller: updatesubTodoFunction-finduserDetails", 10);
            let apiResponse = response.generate(
              true,
              "Failed To Find User Details",
              500,
              null
            );
            reject(apiResponse);
          } else if (check.isEmpty(userDetails)) {
            logger.info("No user Found", "Todo  Controller:updatesubTodoFunction-findUserDetails");
            let apiResponse = response.generate(
              true,
              "No User Found",
              404,
              null
            );
            reject(apiResponse);
          } else {
            let apiResponse = response.generate(
              false,
              "User Details Found",
              200,
              userDetails
            );
            resolve(userDetails);
          }
        });
    });
  };

  let findsubTodoDetails = (req, res) => {
    return new Promise((resolve, reject) => {
      subTodo
        .findOne({ subTodoId: req.params.subTodoId })
        .select()
        .lean()
        .exec((err, subTodoDetails) => {
          if (err) {
            console.log(err);
            logger.error(
              err.message,
              "Todo Controller: updatesubTodoFunction-findsubTodoDetails",
              10
            );
            let apiResponse = response.generate(
              true,
              "Failed To Find Todo Details",
              500,
              null
            );
            reject(apiResponse);
          } else if (check.isEmpty(subTodoDetails)) {
            logger.info("No sub Todo Found", "Todo Controller:updatesubTodoFunction-findsubTodoDetails");
            let apiResponse = response.generate(
              true,
              "No SubTodo Found",
              404,
              null
            );
            reject(apiResponse);
          } else {
            let apiResponse = response.generate(
              false,
              "Sub Todo Details Found",
              200,
              subTodoDetails
            );
            resolve(subTodoDetails);
          }
        });
    });
  }; 

  let updatesubTodo = subTodoDetails => {
    return new Promise((resolve, reject) => {
      let subTodoModifiedById;
      findUserDetails(req.body.subTodoModifiedBy)
        .then(id => {
          subTodoModifiedById = id._id;
        })
        .then(() => {
          let options = {
            subTodoName: req.body.subTodoName,
            subTodoModifiedBy: subTodoModifiedById,
            subTodoModifiedDate: time.now()
          };
          subTodo
            .update({ subTodoId: req.params.subTodoId }, options)
            .exec((err, result) => {
              if (err) {
                console.log(err);
                logger.error(err.message, "Todo Controller:updatesubTodoFunction-updatesubTodo", 10);
                let apiResponse = response.generate(
                  true,
                  "Failed To Update Sub Todo Details",
                  500,
                  null
                );
                reject(apiResponse);
              } else if (check.isEmpty(result)) {
                logger.info("No Sub Todo Found", "Todo Controller:updatesubTodoFunction-updatesubTodo");
                let apiResponse = response.generate(
                  true,
                  "No SubTodo Found",
                  404,
                  null
                );
                reject(apiResponse);
              } else {
                console.log(result, "update result");
                let apiResponse = response.generate(
                  false,
                  "Sub Todo Found and Updated",
                  200,
                  result
                );
                resolve(apiResponse);
              }
            }); 
        });
    });
  }; 

  findsubTodoDetails(req, res)
    .then(updatesubTodo)
    .then(resolve => {
      res.send(resolve);
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
};

let deletesubTodoFunction = (req, res) => {
  let findsubTodoDetails = (req, res) => {
    return new Promise((resolve, reject) => {
      subTodo
        .findOne({ subTodoId: req.params.subTodoId })
        .select()
        .lean()
        .exec((err, subTodoDetails) => {
          if (err) {
            console.log(err);
            logger.error(
              err.message,
              "Todo Controller: deletesubTodoFunction-findsubTodoDetails",
              10
            );
            let apiResponse = response.generate(
              true,
              "Failed To Find sub Todo Details to update",
              500,
              null
            );
            reject(apiResponse);
          } else if (check.isEmpty(subTodoDetails)) {
            logger.info("No List Found", "Todo  Controller:deletesubTodoFunction-findsubTodoDetails");
            let apiResponse = response.generate(
              true,
              "No Sub Todo Found to update",
              404,
              null
            );
            reject(apiResponse);
          } else {
            let apiResponse = response.generate(
              false,
              "Sub Todo Details Found and Updated",
              200,
              subTodoDetails
            );
            resolve(subTodoDetails);
          }
        });
    });
  };

  let deletesubTodoIdAtParent = subTodoDetails => {
    return new Promise((resolve, reject) => {
      let options = { $pull: { subtodo: subTodoDetails._id } };
      Todo.update({ _id: subTodoDetails.ownerTodo }, options)
        .select()
        .lean()
        .exec((err, subTodoDetails) => {
          if (err) {
            console.log(err);
            logger.error(err.message, "Todo Controller: deletesubTodoFunction-deletesubTodoIdAtParent", 10);
            let apiResponse = response.generate(
              true,
              "Failed To Find Parent Todo to remove sub Todo Id",
              500,
              null
            );
            reject(apiResponse);
          } else if (check.isEmpty(subTodoDetails)) {
            logger.info("No subTodo Found", "Todo  Controller: deletesubTodoFunction-deletesubTodoIdAtParent");
            let apiResponse = response.generate(
              true,
              "No Todo Found to remove sub Todo Id",
              404,
              null
            );
            reject(apiResponse);
          } else {
            let apiResponse = response.generate(
              false,
              "Todo Details Found and removed subTodo Id at parent",
              200,
              subTodoDetails
            );
            resolve(apiResponse);
          }
        });
    });
  };

  let deletesubTodoById = () => {
    return new Promise((resolve, reject) => {
      subTodo
        .findOneAndRemove({ subTodoId: req.params.subTodoId })
        .select()
        .lean()
        .exec((err, subTodoDelete) => {
          if (err) {
            console.log(err);
            logger.error(err.message, "Todo Controller: deletesubTodoFunction-deletesubTodoById", 10);
            let apiResponse = response.generate(
              true,
              "Failed To Find subTodo to remove",
              500,
              null
            );
            reject(apiResponse);
          } else if (check.isEmpty(subTodoDelete)) {
            logger.info("No List Found", "Todo  Controller:deletesubTodoFunction-deletesubTodoById");
            let apiResponse = response.generate(
              true,
              "No sub Todo found to remove",
              404,
              null
            );
            reject(apiResponse);
          } else {
            let apiResponse = response.generate(
              false,
              "Sub Todo found and Details Updated",
              200,
              subTodoDelete
            );
            resolve(subTodoDelete);
          }
        });
    });
  };

  findsubTodoDetails(req, res)
    .then(deletesubTodoIdAtParent)
    .then(deletesubTodoById)
    .then(resolve => {
      console.log(resolve);
      let apiResponse = response.generate(
        false,
        "Sub Todo found and Details Updated",
        200,
        resolve
      );
      res.send(apiResponse);
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
};

module.exports = {
  addTodoFunction: addTodoFunction,
  getAllTodosFunction: getAllTodosFunction,
  addSubTodoFunction: addSubTodoFunction,
  getTodoDetails: getTodoDetails,
  changeStateFunction: changeStateFunction,
  changeStatesubTodoFunction: changeStatesubTodoFunction,
  getAllTodosByListId: getAllTodosByListId,
  deleteAllTodoById: deleteAllTodoById,
  updateTodoFunction: updateTodoFunction,
  updatesubTodoFunction: updatesubTodoFunction,
  deletesubTodoFunction:deletesubTodoFunction
}; 



  // getAllFriendTodos: getAllFriendTodos,
// let getAllFriendTodos = (req, res) => {
//   console.log(req.params.friendId, "friendid");
//   let findUserDetails = value => {
//     return new Promise((resolve, reject) => {
//       User.findOne({ userId: value })
//         .select("_id")
//         .lean()
//         .exec((err, todoDetails) => {
//           if (err) {
//             console.log(err);
//             logger.error(err.message, "Todo Controller: findTodoDetails", 10);
//             let apiResponse = response.generate(
//               true,
//               "Failed To Find Todo Details",
//               500,
//               null
//             );
//             reject(apiResponse);
//           } else if (check.isEmpty(todoDetails)) {
//             logger.info("No Todo Found", "Todo  Controller:findTodoDetails");
//             let apiResponse = response.generate(
//               true,
//               "No Todo Found",
//               404,
//               null
//             );
//             reject(apiResponse);
//           } else {
//             let apiResponse = response.generate(
//               false,
//               "Todo Details Found",
//               200,
//               todoDetails
//             );
//             resolve(todoDetails);
//           }
//         });
//     });
//   };

//   let findFriendTodos = (req, res) => {
//     // console.log(req.params.friendId,'friendid');

//     return new Promise((resolve, reject) => {
//       let friendObjectId;

//       findUserDetails(req.params.friendId)
//         .then(id => {
//           console.log(id._id, "modified id");
//           friendObjectId = id._id;
//         })
//         .then(() => {
//           console.log(friendObjectId, "friendobjectid");
//           Todo.find({ todoCreatedBy: friendObjectId })
//             .populate("subtodo")
//             .populate("todoCreatedBy")
//             .populate("todoModifiedBy")
//             .select()
//             .lean()
//             .exec((err, ItemDetails) => {
//               if (err) {
//                 console.log(err);
//                 logger.error(err.message, "Item Controller: findTodoItems", 10);
//                 let apiResponse = response.generate(
//                   true,
//                   "Failed To Find Todo Items",
//                   500,
//                   null
//                 );
//                 reject(apiResponse);
//               } else {
//                 let apiResponse = response.generate(
//                   false,
//                   "Todo Items Found and Listed",
//                   200,
//                   ItemDetails
//                 );
//                 resolve(apiResponse);
//               }
//             });
//         });
//     });
//   };

//   findFriendTodos(req, res)
//     .then(resolve => {
//       //let apiResponse = response.generate(false, 'Items Found and Itemed', 200, resolve)
//       res.send(resolve);
//     })
//     .catch(err => {
//       console.log(err);
//       res.send(err);
//     });
// };
