// authentication middleware

import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import User from "../models/user.model";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
      status: "failed",
      code: 401,
    });
  }

  try {
    const decoded: any = verify(token, process.env.JWT_KEY as string);
    const user = await User.findById(decoded?.user._id).exec();

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
        status: "failed",
        code: 401,
      });
    }

    req.body.user = user;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized",
      status: "failed",
      code: 401,
    });
  }
}
