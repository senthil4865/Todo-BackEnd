const mongoose = require("mongoose");
const shortid = require("shortid");
const time = require("../libs/timeLib");
const response = require("../libs/responseLib");
const logger = require("../libs/loggerLib");
const check = require("../libs/checkLib");
const emailLib = require("../libs/emailLib");
const User = require("../models/User");
const Notify = require("../models/Notify");
const List = require("../models/List");
const ObjectId = require('mongodb').ObjectID;
const Todo = require("../models/Todo");

let addListFunction = (req, res) => {
  console.log(req.body, "req body");
  let validateUserInput = () => {
    return new Promise((resolve, reject) => {
      if (
        req.body.listName &&
        req.body.listCreatedBy &&
        req.body.listModifiedBy
      ) {
        resolve(req);
      } else {
        logger.error(
          "Field Missing During List Creation",
          "ListController: addList()",
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
  }; // end validate user input

  let findUserDetails = value => {
    return new Promise((resolve, reject) => {
      User.findOne({ userId: value })
        .select("_id")
        .lean()
        .exec((err, todoDetails) => {
          if (err) {
            console.log(err);
            logger.error(err.message, "Todo Controller: findTodoDetails", 10);
            let apiResponse = response.generate( true,"Failed To Find Todo Details",500,null);
            reject(apiResponse);
          } else if (check.isEmpty(todoDetails)) {
            logger.info("No Todo Found", "Todo  Controller:findTodoDetails");
            let apiResponse = response.generate(true,"No Todo Found",404,null);
            reject(apiResponse);
          } else {
            let apiResponse = response.generate(false,"Todo Details Found",200,todoDetails);
            resolve(todoDetails);
          }
        });
    });
  };
  let addList = () => {
    return new Promise((resolve, reject) => {
      let ListCreatedById;
      let ListModifiedById;

      findUserDetails(req.body.listCreatedBy)
        .then(id => {
          console.log(id, "id");
          console.log(id._id, "created id");
          ListCreatedById = id._id;
        })
        .then(() => {
          findUserDetails(req.body.listModifiedBy)
            .then(id => {
              console.log(id);
              console.log(id._id, "modified id");
              ListModifiedById = id._id;
            })
            .then(() => {
              //console.log(req.body)
              let newList = new List({
                ListId: shortid.generate(),
                ListName: req.body.listName,
                ListCreatedBy: ListCreatedById,
                ListModifiedBy: ListModifiedById,
                ListCreatedDate: time.now(),
                ListModifiedDate: time.now()
              });

              console.log(newList);
              newList.save((err, newList) => {
                if (err) {
                  console.log(err);
                  logger.error(err.message, "ListController: addList", 10);
                  let apiResponse = response.generate(
                    true,
                    "Failed to add new List",
                    500,
                    null
                  );
                  reject(apiResponse);
                } else {
                  let newListObj = newList.toObject();
                  resolve(newListObj);
                }
              });
            });
        });
    });
  }; // end addList function

  validateUserInput(req, res)
    .then(addList)
    .then(resolve => {
      let apiResponse = response.generate(false, "List Created", 200, resolve);
      res.send(apiResponse);
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
}; // end addListFunction


let getAllListsFunction = (req, res) => {
     console.log(req.params.userId,'req params userid');
         let findUserDetails = () => {
        return new Promise((resolve, reject) => {
            User.findOne({ userId: req.params.userId })
                .select()
                .lean()
                .exec((err, userDetails) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'List Controller: findUserDetails', 10)
                        let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(userDetails)) {
                        logger.info('No User Found', 'List  Controller:findLists')
                        let apiResponse = response.generate(true, 'No User Found', 404, null)
                        reject(apiResponse)
                    } else {
                        let apiResponse = response.generate(false, 'User Details Found', 200, userDetails)
                        resolve(userDetails)
                    }
                })
        })
    }// end finduserDetails

    let findLists = (userDetails) => {
        return new Promise((resolve, reject) => {

            List.find({ 'ListCreatedBy': userDetails._id})
                .select()
                .lean()
                .exec((err, ListDetails) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'List Controller: findLists', 10)
                        let apiResponse = response.generate(true, 'Failed To Find Lists', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(ListDetails)) {
                        logger.info('No List Found', 'List  Controller:findLists')
                        let apiResponse = response.generate(true, 'No List Found', 404, null)
                        reject(apiResponse)
                    } else {
                        let apiResponse = response.generate(false, 'Lists Found and Listed', 200, ListDetails)
                        resolve(apiResponse)
                    }
                })
        })
    }// end findLists


    findUserDetails(req, res)
        .then(findLists)
        .then((resolve) => {
            //let apiResponse = response.generate(false, 'Lists Found and Listed', 200, resolve)
            res.send(resolve)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })

}



let updateListFunction = (req, res) => {
    let findUserDetails = value => {
        return new Promise((resolve, reject) => {
          User.findOne({ userId: value })
            .select("_id")
            .lean()
            .exec((err, userDetails) => {
              if (err) {
                console.log(err);
                logger.error(err.message, "Todo Controller: findTodoDetails", 10);
                let apiResponse = response.generate( true,"Failed To Find Todo Details",500,null);
                reject(apiResponse);
              } else if (check.isEmpty(userDetails)) {
                logger.info("No Todo Found", "Todo  Controller:findTodoDetails");
                let apiResponse = response.generate(true,"No Todo Found",404,null);
                reject(apiResponse);
              } else {
                let apiResponse = response.generate(false,"Todo Details Found",200,userDetails);
                resolve(userDetails);
              }
            });
        });
      };

    let findListDetails = () => {
      
        return new Promise((resolve, reject) => {
            List.findOne({ ListId: req.params.listId })
                .select()
                .lean()
                .exec((err, ListDetails) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'List Controller: findListDetails', 10)
                        let apiResponse = response.generate(true, 'Failed To Find List Details', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(ListDetails)) {
                        logger.info('No List Found', 'List  Controller:findListDetails')
                        let apiResponse = response.generate(true, 'No List Found', 404, null)
                        reject(apiResponse)
                    } else {
                        let apiResponse = response.generate(false, 'List Details Found', 200, ListDetails)
                        resolve(ListDetails)
                    }
                })
        })
    }// end findListdetails

    let updateList = (ListDetails) => {
        return new Promise((resolve, reject) => {
           let ListModifiedById;
           console.log(req.body.ListModifiedBy,'list modified by');
            findUserDetails(req.body.ListModifiedBy).then(id=>{
                ListModifiedById = id._id;
            }).then(()=>{

                let options ={
                 ListName:req.body.ListName,
                 ListModifiedBy:ListModifiedById,
                 ListModifiedDate:time.now()
                }                             
            List.update({ ListId: req.params.listId }, options).exec((err, result) => {
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
        })
    }// end updateList function


    findListDetails(req, res)
        .then(updateList)
        .then((resolve) => {
            //let apiResponse = response.generate(false, 'List Updated', 200, "None")
            res.send(resolve)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })

}// end updateListFunction



let deleteListFunction = (req, res) => {

    let findListDetails = () => {
        return new Promise((resolve, reject) => {
            List.findOne({ ListId: req.params.listId })
                .select()
                .lean()
                .exec((err, ListDetails) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'List Controller: findListDetails', 10)
                        let apiResponse = response.generate(true, 'Failed To Find List Details', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(ListDetails)) {
                        logger.info('No List Found', 'List  Controller:findListDetails')
                        let apiResponse = response.generate(true, 'No List Found', 404, null)
                        reject(apiResponse)
                    } else {
                        let apiResponse = response.generate(false, 'List Details Found', 200, ListDetails)
                        resolve(ListDetails)
                    }
                })
        })
    }// end validate user input
   
    let deleteList = (ListDetails) => {
        return new Promise((resolve, reject) => {

            List.findOneAndRemove({ ListId: req.params.listId }).exec((err, result) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'List Controller: deleteList', 10)
                    let apiResponse = response.generate(true, 'Failed To delete List', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No List Found', 'List Controller: deleteList')
                    let apiResponse = response.generate(true, 'No List Found', 404, null)
                    reject(apiResponse)
                } else {
                    let apiResponse = response.generate(false, 'Deleted the List successfully', 200, null)
                    resolve(apiResponse)
                }
            });// end List model find and remove

       })
   }// end deleteList function


       findListDetails()
        .then(findListDetails)
        .then(deleteList)
        .then((resolve) => {
            res.send(resolve);
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })

}// end deleteListFunction 


let getListDetails = (req, res) => {
    List.findOne({ListId: req.params.listId })
        .select()
        .lean()
        .exec((err, ListDetails) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'List Controller: getListDetails', 10)
                let apiResponse = response.generate(true, 'Failed To Find Lists', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(ListDetails)) {
                logger.info('No List Found', 'List  Controller:getListDetailsFunction')
                let apiResponse = response.generate(true, 'No List Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'List Found', 200, ListDetails)
                res.send(apiResponse)
            }
        })
}


let getAllFriendsListFunction=(req,res)=>{

    let findUserDetails = () => {
        return new Promise((resolve, reject) => {
            User.findOne({ userId: req.params.friendId })
                .select()
                .lean()
                .exec((err, userDetails) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'List Controller: findListDetails', 10)
                        let apiResponse = response.generate(true, 'Failed To Find List Details', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(ListDetails)) {
                        logger.info('No List Found', 'List  Controller:findListDetails')
                        let apiResponse = response.generate(true, 'No List Found', 404, null)
                        reject(apiResponse)
                    } else {
                        let apiResponse = response.generate(false, 'List Details Found', 200, ListDetails)
                        resolve(userDetails)
                    }
                })
        })
    }



    findUserDetails(req, res)
    .then(deleteList)
    .then((resolve) => {
        //let apiResponse = response.generate(false, 'Deleted the List successfully', 200, resolve)
        res.send(resolve)
    })
    .catch((err) => {
        console.log(err);
        res.send(err);
    })

};


module.exports = {
  addListFunction: addListFunction,
  updateListFunction: updateListFunction,
  deleteListFunction: deleteListFunction,
  getAllListsFunction: getAllListsFunction,
  getListDetails: getListDetails,
  getAllFriendsListFunction:getAllFriendsListFunction
};
