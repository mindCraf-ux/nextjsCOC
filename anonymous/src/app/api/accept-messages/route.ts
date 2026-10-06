//here we talk about mssg 1)is user toggle or not 2) is user accepting the mssg or not

//for this we have to write two api's
//1) simple post (to update the status)
//2) simple get (to know the status)
//3) another api through which all mssg of logged in user is fetched for this we use mongodb aggregation pipeline

//here we used session to identify which user is loged in 

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import Usermodel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect()

  const session = await getServerSession(authOptions)
  const user: User = session?.user as any

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated"
      },
      { status: 401 }
    )
  }

  const userId = user._id?.toString();

  const { acceptMessages } = await request.json()

  try {
    const updatedUser = await Usermodel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    )

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update user status to accept messages"
        },
        { status: 401 }
      )
    }

    return Response.json(
      {
        success: true,
        message: "User status updated to accept messages successfully",
        updatedUser
      },
      { status: 200 }
    )
  }
  catch (error) {
    console.log("failed to update user status to accept messages")
    return Response.json(
      {
        success: false,
        message: "Failed to update user status to accept messages"
      },
      { status: 500 }
    )
  }

}