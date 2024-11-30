import z from "zod"
const signUpSchema = z.object({
    username:z.string().min(3,"User name must be min 3").max(32,"user name max 32"),
    
})