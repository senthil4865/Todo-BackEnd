const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const time = require('../libs/timeLib');

const TodoSchema=new Schema({
    ownerList:{ type: Schema.Types.ObjectId, ref: "List" },
    todoId:{type:String,default:''},
    todoName:{type:String,default:''},
    todoDescription:{type:String,default:''},
    todoCreatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    todoModifiedBy:{type: Schema.Types.ObjectId, ref:"User"},
    todoCreatedDate:{type:Date,default:time.now()},
    todoModifiedDate:{type:Date,default:time.now()},
    completed:{type:Boolean,default:false},
    subtodo:[{type: Schema.Types.ObjectId,ref:'SubTodo'}]
},{
    usePushEach: true
  })

module.exports=mongoose.model('Todo',TodoSchema);