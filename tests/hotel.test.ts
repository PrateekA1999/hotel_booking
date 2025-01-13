import commonTest from "../Utils/test";
import { Request, Response } from "express";
import * as hotelRepository from "../Repositories/hotelRepository";
import {
  createBooking,
  getAvailableRooms,
  getBookingDetails,
  updateBooking,
} from "../Controllers/hotelController";
import db from "../Utils/dbConnection";

describe("Hotel", () => {
  let req: Partial<Request>, res: Partial<Response>;
  let statusStub: any, jsonStub: any;

  describe("getAvailableRoms", () => {
    let getAvailableRoomsByTypeStub: any;

    beforeEach(() => {
      req = {
        body: {
          check_in: "2025-01-14",
          check_out: "2025-01-16",
        },
      };
      res = {
        json: commonTest.sinon.stub().returnsThis(),
        status: commonTest.sinon.stub().returnsThis(),
      };

      statusStub = res.status;
      jsonStub = res.json;
    });

    afterEach(() => {
      commonTest.sinon.restore();
    });

    it("should return no available rooms", async () => {
      getAvailableRoomsByTypeStub = commonTest.sinon
        .stub(hotelRepository, "getAvailableRoomsByType")
        .resolves([
          {
            room_type: "Normal",
            available_room_ids: "1,2,3",
          },
          {
            room_type: "Deluxe",
            available_room_ids: "4,5,6",
          },
          {
            room_type: "Villa",
            available_room_ids: "7,8,9",
          },
          {
            room_type: "Cottage",
            available_room_ids: "10,11,12",
          },
        ]);

      await getAvailableRooms(req, res);

      commonTest.sinon.assert.calledOnceWithExactly(statusStub, 200);
      commonTest.sinon.assert.calledOnceWithExactly(jsonStub, {
        rooms: [
          {
            room_type: "Normal",
            available_room_ids: ["1", "2", "3"],
          },
          {
            room_type: "Deluxe",
            available_room_ids: ["4", "5", "6"],
          },
          {
            room_type: "Villa",
            available_room_ids: ["7", "8", "9"],
          },
          {
            room_type: "Cottage",
            available_room_ids: ["10", "11", "12"],
          },
        ],
      });
    });

    it("should return available rooms", async () => {
      getAvailableRoomsByTypeStub = commonTest.sinon
        .stub(hotelRepository, "getAvailableRoomsByType")
        .resolves([]);

      await getAvailableRooms(req, res);

      commonTest.sinon.assert.calledOnceWithExactly(statusStub, 404);
      commonTest.sinon.assert.calledOnceWithExactly(jsonStub, {
        message: "No rooms available",
      });
    });
  });

  describe("createBooking", () => {
    let poolStub: any,
      statusStub: any,
      jsonStub: any,
      createBookingStub: any,
      createBookedRoomsMappingStub: any;

    beforeEach(() => {
      poolStub = commonTest.sinon.stub(db, "getConnection").resolves({
        query: commonTest.sinon.stub().resolves([]),
        release: commonTest.sinon.stub(),
        beginTransaction: commonTest.sinon.stub(),
        commit: commonTest.sinon.stub(),
        rollback: commonTest.sinon.stub(),
      });

      req = {
        user: { id: 1 },
        body: {
          check_in: "2025-01-14",
          check_out: "2025-01-16",
          room_ids: [1, 2, 3],
        },
      };
      res = {
        json: commonTest.sinon.stub().returnsThis(),
        status: commonTest.sinon.stub().returnsThis(),
      };

      statusStub = res.status;
      jsonStub = res.json;

      createBookingStub = commonTest.sinon
        .stub(hotelRepository, "createBooking")
        .resolves([{ resultId: 1 }]);
      createBookedRoomsMappingStub = commonTest.sinon
        .stub(hotelRepository, "createBookedRoomsMapping")
        .resolves([]);
    });

    afterEach(() => {
      commonTest.sinon.restore();
    });

    it("should create booking", async () => {
      await createBooking(req, res);

      commonTest.sinon.assert.calledOnceWithExactly(statusStub, 200);
      commonTest.sinon.assert.calledOnceWithExactly(jsonStub, {
        message: "Booking created successfully",
        id: 1,
        check_in: "2025-01-14",
        check_out: "2025-01-16",
        room_ids: [1, 2, 3],
      });
    });
  });

  describe("getBookingDetails", () => {
    let statusStub: any, jsonStub: any, getBookingsByUserIdOrBookingIdStub: any;

    beforeEach(() => {
      req = {
        user: { id: 1 },
      };
      res = {
        json: commonTest.sinon.stub().returnsThis(),
        status: commonTest.sinon.stub().returnsThis(),
      };

      statusStub = res.status;
      jsonStub = res.json;

      getBookingsByUserIdOrBookingIdStub = commonTest.sinon
        .stub(hotelRepository, "getBookingsByUserIdOrBookingId")
        .resolves([
          {
            booking_id: 1,
            check_in: "2025-01-14",
            check_out: "2025-01-16",
            booking_status: 1,
            room_id: 1,
            room_type: "Normal",
          },
          {
            booking_id: 1,
            check_in: "2025-01-14",
            check_out: "2025-01-16",
            booking_status: 1,
            room_id: 2,
            room_type: "Deluxe",
          },
          {
            booking_id: 1,
            check_in: "2025-01-14",
            check_out: "2025-01-16",
            booking_status: 1,
            room_id: 3,
            room_type: "Villa",
          },
        ]);
    });

    afterEach(() => {
      commonTest.sinon.restore();
    });

    it("should get booking details without booking id", async () => {
      await getBookingDetails(req, res);

      commonTest.sinon.assert.calledOnceWithExactly(statusStub, 200);
      commonTest.sinon.assert.calledOnceWithExactly(jsonStub, {
        bookings: [
          {
            id: 1,
            check_in: "2025-01-14",
            check_out: "2025-01-16",
            booking_status: "Booked",
            rooms: [
              {
                room_id: 1,
                room_type: "Normal",
              },
              {
                room_id: 2,
                room_type: "Deluxe",
              },
              {
                room_id: 3,
                room_type: "Villa",
              },
            ],
          },
        ],
      });
    });

    it("should get booking details with booking id", async () => {
      req.query = { id: 1 };

      await getBookingDetails(req, res);

      commonTest.sinon.assert.calledOnceWithExactly(statusStub, 200);
      commonTest.sinon.assert.calledOnceWithExactly(jsonStub, {
        bookings: [
          {
            id: 1,
            check_in: "2025-01-14",
            check_out: "2025-01-16",
            booking_status: "Booked",
            rooms: [
              {
                room_id: 1,
                room_type: "Normal",
              },
              {
                room_id: 2,
                room_type: "Deluxe",
              },
              {
                room_id: 3,
                room_type: "Villa",
              },
            ],
          },
        ],
      });
    });
  });

  describe("updateBooking", () => {
    let statusStub: any, jsonStub: any;

    beforeEach(() => {
      commonTest.sinon.stub(db, "getConnection").resolves({
        query: commonTest.sinon.stub().resolves([]),
        release: commonTest.sinon.stub(),
        beginTransaction: commonTest.sinon.stub(),
        commit: commonTest.sinon.stub(),
        rollback: commonTest.sinon.stub(),
      });

      req = {
        params: { id: 1 },
        body: {
          check_in: "2025-01-14",
          check_out: "2025-01-17",
          occupied_rooms: [
            { id: 1, type: "Normal" },
            { id: 2, type: "Deluxe" },
            { id: 3, type: "Villa" },
          ],
        },
      };
      res = {
        json: commonTest.sinon.stub().returnsThis(),
        status: commonTest.sinon.stub().returnsThis(),
      };

      statusStub = res.status;
      jsonStub = res.json;
    });

    afterEach(() => {
      commonTest.sinon.restore();
    });

    it("should update booking", async () => {
      commonTest.sinon
        .stub(hotelRepository, "getAvailableRoomsByType")
        .resolves([
          {
            room_type: "Normal",
            available_room_ids: "1,6,7",
          },
          {
            room_type: "Deluxe",
            available_room_ids: "5,8",
          },
          {
            room_type: "Villa",
            available_room_ids: "9,10",
          },
          {
            room_type: "Cottage",
            available_room_ids: "11,12",
          },
        ]);

      commonTest.sinon.stub(hotelRepository, "updateBooking").resolves();

      commonTest.sinon
        .stub(hotelRepository, "deleteBookedRoomsMapping")
        .resolves();

      commonTest.sinon
        .stub(hotelRepository, "createBookedRoomsMapping")
        .resolves();

      await updateBooking(req, res);

      commonTest.sinon.assert.calledOnceWithExactly(statusStub, 200);
      commonTest.sinon.assert.calledOnceWithExactly(jsonStub, {
        message: "Booking updated successfully",
        id: 1,
        check_in: "2025-01-14",
        check_out: "2025-01-17",
        room_ids: ["1", "5", "9"],
      });
    });
  });
});
