import z from "zod"
export const signUpSchema = z.object({
    userName:z.string().min(3,"User name must be min 3").max(32,"user name max 32"),
    email:z.string().email("Invalid email"),
    password:z.string().min(3,"Min 3 characters").max(32,"Password must be max 32")  
})
export const signInSchema = z.object({
    email:z.string().email("Invalid email"),
    password:z.string().min(3,"Min 3 characters").max(32,"Password must be max 32")  
})
export const createRoom = z.object({
    roomName: z.string().min(3,"Room name min 3 chars").max(32,"Max chars 32"),
    creatorId: z.string(),
    mapId: z.string()
})
export const updateRoom = z.object({
    roomName: z.string().min(3, "Room name must be at least 3 characters").max(32, "Room name cannot exceed 32 characters").optional(),
    isActive: z.boolean().optional(),
})


export const updateUserSchema = z.object({
    userName: z.string().min(3, "Username must be at least 3 characters").max(32, "Username cannot exceed 32 characters").optional(),
    email: z.string().email("Invalid email address").optional(),
});


export type TSignUpType = z.infer<typeof signUpSchema>
export type TSignInType = z.infer<typeof signInSchema>
export type TCreateRoomType = z.infer<typeof createRoom>
export type TUpdateUserType = z.infer<typeof updateUserSchema>