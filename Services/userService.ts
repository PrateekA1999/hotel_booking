import { getBookingsByUserId } from "../Repositories/hotelRepository";
import {
  createUser,
  getUserByEmailOrPhone,
  getUserById,
  updateUser,
} from "../Repositories/userRepository";
import { createPayload, updatePayload } from "../types/userTypes";
import { CustomError } from "../Utils/customError";

export const createUserService = async (body: createPayload) => {
  const user = await getUserByEmailOrPhone(body.email, body.phone_number);

  if (user.length > 0) {
    throw new CustomError("User already exists with this email or phone", 400);
  }

  body.active = true;

  await createUser(body);

  return { message: "User created successfully" };
};

export const updateUserService = async (id: number, body: updatePayload) => {
  const user = await getUserById(id);

  if (user.length == 0) {
    throw new CustomError("User does not exists", 404);
  }

  await updateUser(id, body);

  return { message: "User updated successfully" };
};

export const updateUserStatusService = async (
  id: number,
  body: { active: boolean }
) => {
  const booking = await getBookingsByUserId(id);

  if (booking.length > 0) {
    throw new CustomError(
      "User cannot be deactivated as it has bookings. Delete the bookings first and try again",
      400
    );
  }

  await updateUser(id, body);

  return {
    message: `User ${body.active ? "activated" : "deactivated"} successfully`,
  };
};

export const getUserByIdService = async (id: number) => {
  const [user] = await getUserById(id);

  return user;
};

export const changePasswordService = async (
  id: number,
  body: { password: string }
) => {
  await updateUser(id, body);

  return { message: "Password changed successfully" };
};
