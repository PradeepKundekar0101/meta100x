import { catchAsync } from "../utils/Api";
import prismaClient from "@repo/db/client"
import {Request,Response} from "express"
export const signUp = catchAsync(async()=>{
    
    const existingUser = await prismaClient.user.findFirst({
        where:{

        }
    })
})
export const signIn = catchAsync(async()=>{

})
