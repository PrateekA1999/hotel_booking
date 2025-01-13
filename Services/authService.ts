import { log } from "console";
import { getUserByEmailAndPassword } from "../Repositories/userRepository";
import { CustomError } from "../Utils/customError";
import jwt from "jsonwebtoken";

export const getToken = async (email: string, password: string) => {
  const user = await getUserByEmailAndPassword(email, password);

  if (user.length === 0) {
    throw new CustomError("Invalid email or password", 401);
  }

  const token = jwt.sign(
    { email: email, id: user[0].id },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1h",
    }
  );

  return token;
};
