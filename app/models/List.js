const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const time = require('../libs/timeLib');

const ListSchema=new Schema({
    ListId:{type:String,default:''},
    ListName:{type:String,default:''},
    ListCreatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    ListModifiedBy:{type: Schema.Types.ObjectId, ref:"User"},
    ListCreatedDate:{type:Date,default:time.now()},
    ListModifiedDate:{type:Date,default:time.now()},
    Todos:[{type:Schema.Types.ObjectId,ref:"Todo"}]
},{
    usePushEach: true
  })


module.exports=mongoose.model('List',ListSchema);