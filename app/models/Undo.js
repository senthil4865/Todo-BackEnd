const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const UndoSchema=new Schema({
    undoId:{type:String,default:'',index:true,unique:true},
    listId:{type:String,default:''},
    todoId:{type:String,default:''},
    subTodoId:{type:String,default:''},
    action:{type:String,default:''},
    actionCreated:{type:Date,default:Date.now()},
    todoValues:[],
    subTodoValues:[]
});


module.exports=mongoose.model('Undo',UndoSchema);