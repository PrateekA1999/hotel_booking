import db from "../Utils/dbConnection";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { CustomError } from "../Utils/customError";
import joi from "joi";

dotenv.config();

const loginSchema = joi
  .object({
    email: joi.string().trim().email().required().label("Email"),
    password: joi.string().trim().required().label("Password"),
  })
  .and("email", "password");

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new CustomError("Unauthorized", 401);
    }

    // Check if the token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    const [user] = await (
      await db
    ).query("SELECT id FROM users WHERE email = ?", [
      (decoded as JwtPayload).email,
    ]);

    if (!user && req?.params?.id !== user.id) {
      throw new CustomError("Unauthorized", 401);
    }

    req.user = {
      id: user.id,
      email: (decoded as JwtPayload).email,
    };
    next();
  } catch (error) {
    console.error(error);
    return error instanceof CustomError
      ? res.status(error.statusCode).json({ message: error.message })
      : res.status(500).json({ message: "Internal Server Error" });
  }
};

export const adminMiddleware = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
