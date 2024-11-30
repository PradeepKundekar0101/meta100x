import { catchAsync } from "../utils/Api";
import prismaClient from "@repo/db/client";
import { signUpSchema, signInSchema } from "@repo/types/zodSchema";
import { Request, Response } from "express";
import AppError from "../utils/AppError";
import {hash,compare} from "../utils/bcrypt"
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "kyunahihoripadhai?"; 
const JWT_EXPIRES_IN = "7d";

export const signUp = catchAsync(async (req: Request, res: Response) => {
    const parsedData = signUpSchema.safeParse(req.body);
    if (!parsedData.success) {
        throw new AppError(400, parsedData.error.message);
    }
    const { userName, email, password } = parsedData.data;
    const existingUser = await prismaClient.user.findFirst({
        where: { email },
    });
    if (existingUser) {
        throw new AppError(409, "User with this email ID already exists");
    }
    const hashedPassword = await hash(password);
    const newUser = await prismaClient.user.create({
        data: {
            userName,
            email,
            password: hashedPassword,
            avatarId:""
        },
    });
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });

    res.status(201).json({
        status: "success",
        data: {
            user: {
                id: newUser.id,
                userName: newUser.userName,
                email: newUser.email,
            },
            token,
        },
    });
});

export const signIn = catchAsync(async (req: Request, res: Response) => {
    const parsedData = signInSchema.safeParse(req.body);
    if (!parsedData.success) {
        throw new AppError(400, parsedData.error.message);
    }
    const { email, password } = parsedData.data;
    const user = await prismaClient.user.findFirst({
        where: { email },
    });

    if (!user) {
        throw new AppError(401, "Invalid email or password");
    }
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
        throw new AppError(401, "Invalid email or password");
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
        status: "success",
        data: {
            user: {
                id: user.id,
                userName: user.userName,
                email: user.email,
            },
            token,
        },
    });
});
