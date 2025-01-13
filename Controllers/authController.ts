import { CustomError } from "../Utils/customError";
import { getToken } from "../Services/authService";

export const login = async (req: any, res: any) => {
  const { email, password } = req.body;
  try {
    const token = await getToken(email, password);

    return res
      .status(200)
      .json({ message: "Login successful", data: { token } });
  } catch (error) {
    console.log(error);
    return error instanceof CustomError
      ? res.status(error.statusCode).json({ message: error.message })
      : res.status(500).json({ message: "Internal Server Error" });
  }
};
