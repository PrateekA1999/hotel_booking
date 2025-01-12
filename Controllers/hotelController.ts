import {
  createBookingService,
  deleteBookingService,
  getAvailableRoomsService,
  getBookingDetailsService,
  getCurrentGuestsService,
  updateBookingService,
} from "../Services/hotelService";
import { CustomError } from "../Utils/customError";

export const getAvailableRooms = async (req, res) => {
  try {
    const body = req.body;
    const rooms = await getAvailableRoomsService(body);
    return res.status(200).json({ rooms });
  } catch (error) {
    console.log(error);
    return error instanceof CustomError
      ? res.status(error.statusCode).json({ message: error.message })
      : res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createBooking = async (req, res) => {
  try {
    const body = req.body;
    const id = req.user.id;
    const booking_details = await createBookingService(id, body);
    return res
      .status(200)
      .json({ message: "Booking created successfully", ...booking_details });
  } catch (error) {
    console.log(error);
    return error instanceof CustomError
      ? res.status(error.statusCode).json({ message: error.message })
      : res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getBookingDetails = async (req, res) => {
  try {
    const booking_id = req.query?.id;
    const user_id = req.user.id;

    const bookings = await getBookingDetailsService(user_id, booking_id);
    return res.status(200).json({ bookings });
  } catch (error) {
    console.log(error);
    return error instanceof CustomError
      ? res.status(error.statusCode).json({ message: error.message })
      : res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const body = req.body;
    const booking_id = req.params.id;
    const booking_details = await updateBookingService(booking_id, body);
    return res
      .status(200)
      .json({ message: "Booking updated successfully", ...booking_details });
  } catch (error) {
    console.log(error);
    return error instanceof CustomError
      ? res.status(error.statusCode).json({ message: error.message })
      : res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking_id = req.params.id;
    await deleteBookingService(booking_id);
    return res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.log(error);
    return error instanceof CustomError
      ? res.status(error.statusCode).json({ message: error.message })
      : res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCurrentGuests = async (req, res) => {
  try {
    const guests = await getCurrentGuestsService();
    return res.status(200).json({ guests });
  } catch (error) {
    console.log(error);
    return error instanceof CustomError
      ? res.status(error.statusCode).json({ message: error.message })
      : res.status(500).json({ message: "Internal Server Error" });
  }
};
