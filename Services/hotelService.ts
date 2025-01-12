import {
  createBooking,
  getAvailableRoomsByType,
  createBookedRoomsMapping,
  getBookingsByUserIdOrBookingId,
  updateBooking,
  deleteBookedRoomsMapping,
  deleteBooking,
  getCurrentBookings,
} from "../Repositories/hotelRepository";
import { getUsersByIds } from "../Repositories/userRepository";
import { CustomError } from "../Utils/customError";
import db from "../Utils/dbConnection";

export const getAvailableRoomsService = async (query) => {
  const { check_in, check_out } = query;

  const rooms = await getAvailableRoomsByType(check_in, check_out);

  if (rooms.length == 0) {
    throw new CustomError("No rooms available", 404);
  }

  const available_rooms = rooms.map((room) => {
    return {
      room_type: room.room_type,
      available_room_ids: room.available_room_ids.split(","),
    };
  });

  return available_rooms;
};

export const createBookingService = async (id, body) => {
  const { check_in, check_out, room_ids } = body;

  const connection = await (await db).getConnection();
  await connection.beginTransaction();

  try {
    const [booking] = await createBooking(
      id,
      { check_in, check_out },
      connection
    );

    await createBookedRoomsMapping(booking.id, room_ids, connection);

    await connection.commit();

    return {
      id: booking.id,
      check_in: booking.check_in,
      check_out: booking.check_out,
      room_ids,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.release();
  }
};

export const getBookingDetailsService = async (id, booking_id) => {
  const bookings = await getBookingsByUserIdOrBookingId(id, booking_id);

  const formatted_bookings = bookings.reduce((acc, booking) => {
    if (!acc[booking.booking_id]) {
      acc[booking.booking_id] = {
        id: booking.booking_id,
        check_in: booking.check_in,
        check_out: booking.check_out,
        rooms: [],
      };
    }

    acc[booking.booking_id].rooms.push({
      room_id: booking.room_id,
      room_type: booking.room_type,
    });

    return acc;
  }, {});

  return booking_id ? formatted_bookings[booking_id] : formatted_bookings;
};

export const updateBookingService = async (id, body) => {
  const connection = await (await db).getConnection();
  await connection.beginTransaction();

  try {
    const rooms = await getAvailableRoomsByType(body.check_in, body.check_out);

    if (rooms.length == 0) {
      throw new CustomError("No rooms available", 404);
    }

    const available_rooms = rooms.map((room) => {
      return {
        room_type: room.room_type,
        available_room_ids: room.available_room_ids.split(","),
      };
    });

    const occupied_rooms = body.occupied_rooms.reduce((acc, room) => {
      if (!acc[room.type]) {
        acc[room.type] = [];
      }

      acc[room.type].push(room.id);

      return acc;
    }, {});

    const is_possible = occupied_rooms.every((room) => {
      if (available_rooms[room.room_type]) {
        return (
          !available_rooms[room.room_type].available_room_ids.length >
          room.length
        );
      }

      return false;
    });

    if (!is_possible) {
      throw new CustomError(
        "Not enough rooms available of required type for expected dates",
        404
      );
    }

    let new_room_ids = available_rooms.reduce((acc, room) => {
      if (
        room.available_room_ids.length >= occupied_rooms[room.room_type].length
      ) {
        acc.push(
          ...room.available_room_ids.slice(
            0,
            occupied_rooms[room.room_type].length
          )
        );
      }

      return acc;
    }, []);

    await updateBooking(id, body, connection);

    await deleteBookedRoomsMapping(id, connection);

    await createBookedRoomsMapping(id, new_room_ids, connection);

    await connection.commit();

    return {
      id,
      check_in: body.check_in,
      check_out: body.check_out,
      room_ids: new_room_ids,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.release();
  }
};

export const deleteBookingService = async (id) => {
  return await deleteBooking(id);
};

export const getCurrentGuestsService = async () => {
  const bookings = await getCurrentBookings();

  const user_ids: any = [
    ...new Set(bookings.map((item) => item.user_id as number)),
  ];

  const users = await getUsersByIds(user_ids);

  const formatted_bookings = bookings.reduce((acc, booking) => {
    if (!acc[booking.user_id]) {
      acc[booking.user_id] = {
        id: booking.user_id,
        name: users[booking.user_id].name,
        email: users[booking.user_id].email,
        phone_number: users[booking.user_id].phone_number,
        active: users[booking.user_id].active ? true : false,
        bookings: [],
      };
    }

    const book = acc[booking.user_id].bookings.find(
      (item) => item.booking_id === booking.booking_id
    );

    if (!book) {
      acc[booking.user_id].bookings.push({
        booking_id: booking.booking_id,
        check_in: booking.check_in,
        check_out: booking.check_out,
        rooms: [],
      });
    }

    acc[booking.user_id].bookings.forEach((item) => {
      if (item.booking_id === booking.booking_id) {
        item.rooms.push({
          room_id: booking.room_id,
          room_type: booking.room_type,
        });
      }
    });

    return acc;
  }, {});

  return formatted_bookings;
};
