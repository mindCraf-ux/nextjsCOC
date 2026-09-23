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

}
catch(err: any){
  throw new Error(err)
}
}
    })
  ]
 }

