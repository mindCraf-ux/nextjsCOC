import dbConnect from "@/lib/dbConnect";

import Usermodel from "@/model/User";

import { IUser } from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json()
  try {
    const user = await Usermodel.findOne({ username })
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found"
        },
        { status: 404 }
      )
    }

    //if user is not accepting messages
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          suucess: false,
          message: "user is not accepting the messages"
        },
        { status: 403 }
      )
    }

    //now we will create a newMessage

    const newMessage = { content, createdAt: new Date() }
    user.message.push(newMessage as IUser)
    await user.save()

    return Response.json({
      success: true,
      message: "message send successfully"
    },
      { status: 200 }
    )
  }

  catch (error) {
    console.log("error")
    return Response.json(
      {
        success: false,
        message: "Failed to send message"
      },
      { status: 500 }
    )
  }
}



