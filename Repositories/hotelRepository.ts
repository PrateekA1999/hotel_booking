import db from "../Utils/dbConnection";

export const getBookingsByUserId = async (id: number) => {
  return await (
    await db
  ).query(
    `SELECT id AS booking_id, check_in, check_out, is_active FROM bookings WHERE fk_user_id = ? AND check_out >= CURDATE() AND is_active = 1`,
    [id]
  );
};

export const getCurrentBookings = async () => {
  return await (
    await db
  ).query(
    `SELECT
        b.id as booking_id,
        b.fk_user_id as user_id,
        b.check_in,
        b.check_out,
        b.is_active as booking_status,
        brm.fk_rooms_id as room_id, r
        r.type as room_type FROM bookings b
    INNER JOIN booked_rooms_mapping brm ON b.id = brm.fk_booking_id
    INNER JOIN rooms r ON brm.fk_rooms_id = r.id
    WHERE check_in <= CURDATE() AND check_out >= CURDATE() AND b.is_active = 1`
  );
};

export const getAvailableRoomsByType = async (
  check_in: string,
  check_out: string
) => {
  return await (
    await db
  ).query(
    `
    SELECT r.type AS room_type, GROUP_CONCAT(r.id) AS available_room_ids
    FROM rooms r
    LEFT JOIN booked_rooms_mapping brm
        ON r.id = brm.fk_rooms_id
    LEFT JOIN booking b
        ON brm.fk_booking_id = b.id
        AND b.is_active = 1
        AND (
            b.check_in <= DATE_FORMAT(?, '%Y-%m-%d') AND b.check_out >= DATE_FORMAT(?, '%Y-%m-%d')
        )
    GROUP BY r.id, r.type
    HAVING COUNT(brm.fk_rooms_id) = 0;`,
    [check_in, check_out]
  );
};

export const updateBooking = async (id: number, body: any, connection) => {
  return await ((await db) || connection).query(
    `UPDATE bookings SET check_in = DATE_FORMAT(?, '%Y-%m-%d'), check_out = DATE_FORMAT(?, '%Y-%m-%d') WHERE id = ?`,
    [body.check_in, body.check_out, id]
  );
};

export const createBooking = async (id: number, body: any, connection) => {
  return await ((await db) || connection).query(
    `INSERT INTO bookings (fk_user_id, check_in, check_out, is_active) VALUES (?, DATE_FORMAT(?, '%Y-%m-%d'), DATE_FORMAT(?, '%Y-%m-%d'), 1)`,
    [id, body.check_in, body.check_out]
  );
};

export const createBookedRoomsMapping = async (
  fk_booking_id: number,
  room_ids: number[],
  connection
) => {
  return await ((await db) || connection).query(
    `INSERT INTO booked_rooms_mapping (fk_booking_id, fk_rooms_id) VALUES ?`,
    room_ids.map((room_id) => [fk_booking_id, room_id])
  );
};

export const deleteBookedRoomsMapping = async (
  fk_booking_id: number,
  connection
) => {
  return await ((await db) || connection).query(
    `DELETE FROM booked_rooms_mapping WHERE fk_booking_id = ?`,
    [fk_booking_id]
  );
};

export const getBookingsByUserIdOrBookingId = async (
  id: number,
  booking_id?: number
) => {
  return await (
    await db
  ).query(
    `
    SELECT
        b.id as booking_id,
        b.check_in,
        b.check_out,
        b.is_active as booking_status,
        brm.fk_rooms_id as room_id, r
        r.type as room_type FROM bookings b
    INNER JOIN booked_rooms_mapping brm ON b.id = brm.fk_booking_id
    INNER JOIN rooms r ON brm.fk_rooms_id = r.id
    WHERE fk_user_id = ? ${booking_id ? "AND b.id = ?" : ""}`,
    [id, ...(booking_id ? [booking_id] : [])]
  );
};

export const deleteBooking = async (id: number) => {
  return await (
    await db
  ).query(`UPDATE bookings SET is_active = 0 WHERE id = ?`, [id]);
};
