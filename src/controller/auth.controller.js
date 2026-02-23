import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { SendRegisterationEmail } from "../services/email.service.js";

/**
 * - User registration controller
 * - POST /api/auth/register
 */

async function userRegister(req, res) {
  const { email, name, password } = req.body;

  const isEmailExist = await UserModel.findOne({
    email: email,
  });
  if (isEmailExist) {
    return res.status(400).json({
      message: "Email already exists",
    });
  }

  const newUser = await UserModel.create({
    email,
    name,
    password,
  });

  const token = jwt.sign(
    {
      userId: newUser._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: newUser._id,
      email: newUser.email,
      name: newUser.name,
    },
    token: token,
  });

  await SendRegisterationEmail(newUser.email, newUser.name);
}

/**
 * - User login controller
 * - POST /api/auth/login
 */

async function userLogin(req, res) {
  const { email, password } = req.body;

  const user = await UserModel.findOne({
    email: email,
  }).select("+password");

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    message: "User logged in successfully",
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
    },
    token: token,
  });
}

export { userRegister, userLogin };
