import { Request, Response, NextFunction, CookieOptions } from "express";

export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);
};

export const sendResponse = (res: Response, statusCode: number, data: any) => {
  res.status(statusCode).json({
    status: "success",
    data,
  });
};
