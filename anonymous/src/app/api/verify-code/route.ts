import dbConnect from "@/lib/dbConnect";
import Usermodel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { responseCookiesToRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export async function POST(request: Request) {
  await dbConnect()


  try {
    const { username, code } = await request.json();

    const decodeUsername = decodeURIComponent(username);
    const user = await Usermodel.findOne({ username: decodeUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found"

        },
        { status: 500 }
      )
    }

    const isCodeValid = user.verifyCode === code
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true
      await user.save()

      return Response.json(
        {
          success: true,
          message: "User verified successfully"

        },
        { status: 200 }
      )
    }

    if (!isCodeValid) {
      return Response.json(
        {
          success: false,
          message: "Invalid code"
        },
        { status: 400 }
      )
    }

    if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Code has expired"
        },
        { status: 400 }
      )
    }
  }

  catch (error) {
    console.error("Error verifying user", error)
    return Response.json(
      {
        success: false,
        message: "Failed to verify user"
      },
      { status: 500 }
    )
  }
}