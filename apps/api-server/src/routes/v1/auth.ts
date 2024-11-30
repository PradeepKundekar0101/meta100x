import express from "express"
import { signIn, signUp } from "../../controller/auth"
const authRouter = express()
authRouter.post("/signin",signIn)
authRouter.post("/signup",signUp)
export default authRouter