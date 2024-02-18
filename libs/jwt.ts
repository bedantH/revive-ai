// authentication middleware

import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import User from "../models/user.model";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
      status: "failed",
      code: 401,
    });
  }

  try {
    const decoded: any = verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(decoded.id).exec();

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
