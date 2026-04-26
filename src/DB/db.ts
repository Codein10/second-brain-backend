import mongoose, { model, Schema } from "mongoose";

mongoose.connect(process.env.MONGO_URI!);
const UserSchema = new Schema({
  username: { type: "string", unique: true },
  password: { type: "string", require: true },
});
export const UserModel =  model("User", UserSchema);


const ContentSchema=new Schema({
  title:"string",
  link:"string",
  tag:[{type:mongoose.Types.ObjectId , ref:"Tag"}],
  type:"string",
  userId:{type:mongoose.Types.ObjectId, ref:"User" , required:true}
})
export const ContentModel=model("Content",ContentSchema)

const LinkSchema=new Schema({
  hash:"string",
  userId:{type:mongoose.Types.ObjectId, ref:"User" , required:true ,unique:true}
})
export const LinkModel=model("Links",LinkSchema)

