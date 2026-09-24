//here we create the next auth options by creating a new file called option.ts in the api/auth/[...nextauth] folder and then we will import this file in the route.ts file and then we will use the authOptions in the NextAuth function.

import {NextAuthOptions} from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";

import dbConnect from "@/lib/dbConnect";
 import bcrypt from "bcrypt";

 import Usermodel from "@/model/User";

 export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
id: "credentials",
name: "credentials",
credentials: {
username: {label: "Email", type: "text"},
password: {label: "Password", type: "password" }
},

async authorize(credentials: any): Promise<any>{

await dbConnect();
try{
const user = await Usermodel.findOne({
$or: [
  {email: credentials.indentifier},
  {username: credentials.indentifier}
]
})

if(!user){
  throw new Error('no user found with this email or username')
}

if(!user.isVerified){
  throw new Error('user is not verified')
}

const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

if (isPasswordCorrect){
  return user 
}
else{
  throw new Error('Please enter correct password/Incorrect password')
}
}
catch(err: any){
  throw new Error(err)
}
}
    })
  ],

  callbacks: {
async jwt ({token, user})
{
  if(user){
    token._id = user._id?.toString()
    token.isVerified = user.isVerified;
token.isAcceptingMessages= user.isAcceptingMessages;
token.username= user.username;

  }
  
  return token
},
    async session ({session, token })
    {
      if(token){
        session.user._id = token._id?.toString()
        session.user.isVerified = token.isVerified
        session.user.isAcceptingMessages = token.isAcceptingMessages
        session.user.username= token.username
      }
      return session
    },

  },

  //nextAuth.js auomatically creates simple, unbranded authenticaton pages for handling sign in, sign out, email verification, and displaying eoor messages
  pages: {
signIn: '/sign-in'
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET
 }

