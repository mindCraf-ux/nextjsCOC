import dbConnect from "@/lib/dbConnect";
import Usermodel from "@/model/User";
import bcrypt from "bcrypt";

import { sendVerificationEmail } from "@/helpers/sendVerficationEmail";

export async function POST(req: Request){
  await dbConnect();

  try{
const {username, email, password} =await req.json()
const existingUserVerifiedByUsername =await Usermodel.findOne({
  username,
  isVerified: true
})
// Check if the username is already taken by a verified user
if (existingUserVerifiedByUsername){
  return Response.json({
    success: false,
    message: "Username is already taken"
  },
  {status: 400}) 
}
  

  const existingUserByEmail= await Usermodel.findOne
  ({email})

  if(existingUserByEmail){

if(existingUserByEmail.isVerified){
  return Response.json({
    success: false,
    message: "user already exists with this email"
  }, {status: 400})
}

else{
  const hashedPassword = await bcrypt.hash(password, 10)
  existingUserByEmail.password = hashedPassword;
existingUserByEmail.verifyCode = verifyCode;
existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // Set expiry to 1 hour from now
await existingUserByEmail.save()
}

  }else{
const hashedPassword = await bcrypt.hash(password, 10)
const expiryDate = new Date()
expiryDate.setHours(expiryDate.getHours() + 1) // Email expires in 1 hour

const newUser = new Usermodel({
   username,
    email,
    password: hashedPassword,
    verifyCode: Math.floor(100000 + Math.random() * 900000).toString(),
    verifyCodeExpiry: expiryDate,
    isVerified: false,
    isAcceptingMessage: true,
    message: []
})

await newUser.save()
  }

  //send verification email
  const emailResponse = await sendVerificationEmail
  (
email,
 username,
  verifyCode,
  )
  
  if(!emailResponse.success){
    return Response.json({
 success: false,
message: "Failed to send verification email"
    }, {status: 500})
  }

   return Response.json({
 success: true,
message: "User registered successfully"
    }, {status: 201})
}
  catch(error){
    console.error('error registration user', error)
    return Response.json(
      {
        success: false,
        message: "error registering user"
      },
      {
        status: 500
      }
    )
  }
}