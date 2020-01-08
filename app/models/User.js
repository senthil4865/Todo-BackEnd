const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const bcrypt=require('bcrypt-nodejs');

let UserSchema = new Schema({
  userId: {type: String,default: "",index: true,unique: true},
  firstName: {type: String,default: ""},
  lastName: { type: String, default: ""},
  countryName: {type: String,default: ""},
  mobileNumber: {type: String,default: ""},
  password: {type: String,default: ""},
  email: { type: String,default: ""},
  validationToken: {type: String,default: ""},
  emailVerified: {type: String,default: "No"},
  friends:{ type:[{friendId:{type:String,default:''},friendName:{type:String,default:''},}],},
  friendRequestReceived:{type:[{friendId:{type:String,default:''},friendName:{type:String,default:''},}],},
  friendRequestSent:{type:[{friendId:{type:String,default:''},friendName:{type:String,default:''},}],},
});
module.exports=mongoose.model('User',UserSchema);













// friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
// friendRequestReceived: [{ type: Schema.Types.ObjectId, ref: 'User' }],
// friendRequestSent: [{ type: Schema.Types.ObjectId, ref: 'User' }]