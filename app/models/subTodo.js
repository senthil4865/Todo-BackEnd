const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const time = require('../libs/timeLib');

const SubTodoSchema=new Schema({
    ownerTodo:{type:Schema.Types.ObjectId,ref:'Todo'},
    subTodoId:{type:String,default:''},
    subTodoName:{type:String,default:''},
    subTodoDescription:{type:String,default:''},
    subTodoCreatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    subTodoModifiedBy:{type: Schema.Types.ObjectId, ref:"User"},
    subTodoCreatedDate:{type:Date,default:time.now()},
    subTodoModifiedDate:{type:Date,default:time.now()},
    completed:{type:Boolean,default:false}
})


module.exports=mongoose.model('SubTodo',SubTodoSchema);