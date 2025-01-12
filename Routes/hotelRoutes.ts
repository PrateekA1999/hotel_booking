import { Router } from "express";
import {
  getAvailableRooms,
  createBooking,
  getBookingDetails,
  updateBooking,
  deleteBooking,
  getCurrentGuests,
} from "../Controllers/hotelController";

const router = Router();

router.post("/available/rooms", getAvailableRooms);
router.post("/book/rooms", createBooking);
router.get("/booking", getBookingDetails);
router.put("/booking/:id", updateBooking);
router.delete("/booking/:id", deleteBooking);
router.get("/guests/staying", getCurrentGuests);

export default router;
