import { getUserByEmailAndPassword } from "../Repositories/userRepository";
import jwt from "jsonwebtoken";

export const login = async (req: any, res: any) => {
  const { email, password } = req.body;

  const user = await getUserByEmailAndPassword(email, password);

  if (user.length > 0) {
    const token = jwt.sign({ email: user[0].email }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    return res.status(200).json({ token });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
};
