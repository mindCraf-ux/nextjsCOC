//here we create a route where we can check username is unique or not

import dbConnect from "@/lib/dbConnect";
import Usermodel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const userNameQuerySchema = z.object({
  username: usernameValidation
})

export async function GET(request: Request) {
  {/*
  //we only allow GET method for this route
  if (request.method !== 'GET') {
    return Response.json(
      {
        success: false,
        message: "Method not allowed"
      },
      { status: 405 }
    )
  }
*/}
  await dbConnect()

  try {
    //we check username through url 
    //create url search params
    const { searchParams } = new URL(request.url)
    //convert search params into object
    const queryParam = { username: searchParams.get('username') }
    //validate with zod
    const result = userNameQuerySchema.safeParse(queryParam)
    //what if !result success
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || []
      return Response.json({
        success: false,
        message: usernameErrors?.length > 0
          ? usernameErrors.join(', ')
          : 'invalid query parameters',
      }, { status: 400 })
    }

    const { username } = result.data
    const existingUser = await Usermodel.findOne({ username, isVerified: true })

    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken"
        },
        { status: 400 }
      )
    }
    return Response.json({
      success: true,
      message: "Username is available"
    }, { status: 200 })



  }
  catch (error) {
    console.error("Error checking username", error)
    return Response.json(
      {
        success: false,
        message: "Failed to check username"
      },
      { status: 500 }
    )
  }
}