import mongoose, {Schema, Document} from "mongoose";

//here we define the interface for the User model, which extends the Document interface from mongoose. This allows us to define the shape of the data that will be stored in the MongoDB collection for users.
export interface IUser extends Document {
  content: string; //here string is the type of the content field  
  createdAt: Date
}
//here we define the schema for the User model, which defines the structure of the data that will be stored in the MongoDB collection for users.
const MessageSchema: Schema<IUser>= new Schema({
content: {
  type: String,
  required: true
},

createdAt: {
  type: Date,
  required: true,
  default: Date.now
}
})

//here we define the interface for the User model, which extends the Document interface from mongoose. This allows us to define the shape of the data that will be stored in the MongoDB collection for users.
export interface User extends Document{
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  message:  IUser[]
}

const UserSchema: Schema<User>= new Schema({
username: {
  type: String,
  required: [true, "UseerName is required"],
  trim: true,
  unique: true
},

email: {
  type: String,
  required: [true, "Email is required"],
  unique: true,
  lowercase: true
},
password: {
  type: String,
  required: [true, "Password is required"],
  minlength: [6, "Password must be at least 6 characters long"]
},
verifyCode: {
  type: String
},
verifyCodeExpiry: {
  type: Date
},

isVerified: {
  type: Boolean,
  default: false
},

isAcceptingMessage: {
  type: Boolean,
  default: true
},
message: [{
  type: Schema.Types.ObjectId,
  ref: "Message"
}]
})

const Usermodel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default Usermodel;
