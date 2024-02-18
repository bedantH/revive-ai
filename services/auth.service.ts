import { NextFunction, Request, Response } from "express";
import {
  comparePassword,
  createUser,
  getUserByEmail,
} from "../controllers/user.controller";

import jwt from "jsonwebtoken";

export async function register(
  req: Request,
  res: Response,
  next?: NextFunction
) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Invalid input",
      status: "failed",
      code: 400,
    });
  }

  let existingUser;
  try {
    existingUser = await getUserByEmail(email);
  } catch (error) {
    return res.status(500).json({
      message: "Signup failed, please try again later.",
      status: "failed",
      code: 500,
    });
  }

  if (existingUser) {
    return res.status(422).json({
      message: "User exists already, please login instead.",
      status: "failed",
      code: 422,
    });
  }

  const newUser = await createUser(name, email, password);

  const token = jwt.sign(
    {
      user: newUser,
    },
    process.env.JWT_KEY as string,
    {
      expiresIn: "1h",
    }
  );
  const refreshToken = jwt.sign(
    {
      user: newUser,
    },
    process.env.JWT_KEY as string,
    {
      expiresIn: "1h",
    }
  );

  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
    })
    .cookie("token", token, {
      httpOnly: true,
    })
    .header("Authorization", `Bearer ${token}`)
    .status(201)
    .json({
      userId: newUser.id,
      email: newUser.email,
      token,
    });
}

export async function login(req: Request, res: Response, next?: NextFunction) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Invalid email or password",
      status: "failed",
      code: 400,
    });
  }

  let existingUser;

  try {
    existingUser = await getUserByEmail(email);
  } catch (err) {
    return res.status(500).json({
      message: "Logging in failed, please try again later.",
      status: "failed",
      code: 500,
    });
  }

  if (!existingUser) {
    return res.status(401).json({
      message: "Invalid email or password",
      status: "failed",
      code: 401,
    });
  }

  const isValidPassword = await comparePassword(existingUser.id, password);

  if (!isValidPassword) {
    return res.status(401).json({
      message: "Invalid email or password",
      status: "failed",
      code: 401,
    });
  }

  const token = jwt.sign(
    {
      user: existingUser,
    },
    process.env.JWT_KEY as string,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    {
      user: existingUser,
    },
    process.env.JWT_KEY as string,
    { expiresIn: "1h" }
  );

  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
    })
    .cookie("token", token, {
      httpOnly: true,
    })
    .header("Authorization", `Bearer ${token}`)
    .status(200)
    .json({
      userId: existingUser.id,
      email: existingUser.email,
      token,
    });
}

export async function logout(req: Request, res: Response, next?: NextFunction) {
  res.clearCookie("refreshToken").status(200).json({
    message: "Logged out",
    status: "success",
    code: 200,
  });
}

export async function refresh(
  req: Request,
  res: Response,
  next?: NextFunction
) {
  const refreshToken = req.cookies?.["refreshToken"];
  if (!refreshToken) {
    return res.status(401).send("Access Denied. No refresh token provided.");
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_KEY as string
    ) as any;
    const accessToken = jwt.sign(
      {
        userId: decoded.userId,
        email: decoded.email,
      },
      process.env.JWT_KEY as string,
      { expiresIn: "1h" }
    );

    res.header("Authorization", accessToken).json({
      message: "Token refreshed successfully",
      status: "success",
      code: 200,
      data: {
        userId: decoded?.userId,
        email: decoded?.email,
        token: accessToken,
      },
    });
  } catch (error) {
    return res.status(400).send("Invalid refresh token.");
  }
}

export async function getMe(req: Request, res: Response) {
  const token = req.cookies.token;

  jwt.verify(token, process.env.JWT_KEY as string, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({
        message: "Forbidden",
        status: "failed",
        code: 403,
      });
    }

    res.status(200).json({
      message: "User fetched successfully",
      status: "success",
      code: 200,
      data: user,
    });
  });
}