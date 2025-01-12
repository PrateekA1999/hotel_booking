import {
  changePasswordService,
  createUserService,
  getUserByIdService,
  updateUserService,
  updateUserStatusService,
} from "../Services/userService";
import { createPayload, updatePayload } from "../types/userTypes";
import { CustomError } from "../Utils/customError";

const createUser = async (req, res) => {
  try {
    const body: createPayload = req.body;
    await createUserService(body);
    return res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    return error instanceof CustomError
      ? res.status(error.statusCode).json({ message: error.message })
      : res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const body: updatePayload = req.body;
    await updateUserService(req.params.id, body);
    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.log(error);
    return error instanceof CustomError
      ? res.status(error.statusCode).json({ message: error.message })
      : res.status(500).json({ message: "Internal Server Error" });
  }
};

const userActiveStatusUpdate = async (req, res) => {
  try {
    const body: { active: boolean } = req.body;
    await updateUserStatusService(req.params.id, body);
    return res.status(200).json({
      message: `User ${body.active ? "activated" : "deactivated"} successfully`,
    });
  } catch (error) {
    console.log(error);
    return error instanceof CustomError
      ? res.status(error.statusCode).json({ message: error.message })
      : res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;

  const user = await getUserByIdService(id);

  return res.status(200).json({ user });
};

const changePassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  await changePasswordService(id, { password });

  return res.status(200).json({ message: "Password changed successfully" });
};

export default {
  createUser,
  updateUser,
  userActiveStatusUpdate,
  getUser,
  changePassword,
};
