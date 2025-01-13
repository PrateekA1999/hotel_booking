import jwt from "jsonwebtoken";
import * as userRepository from "../Repositories/userRepository";
import commonTest from "../Utils/test";
import { login } from "../Controllers/authController";
import { Request, Response } from "express";

describe("Auth", () => {
  let getUserByEmailAndPasswordMock: any,
    signMock: any,
    statusStub: any,
    jsonStub: any;
  let req: Partial<Request>, res: Partial<Response>;

  beforeEach(() => {
    getUserByEmailAndPasswordMock = commonTest.sinon
      .stub(userRepository, "getUserByEmailAndPassword")
      .resolves([{ id: 1 }]);

    signMock = commonTest.sinon.stub(jwt, "sign").returns("token");

    req = {
      body: {
        email: "email",
        password: "password",
      },
    };

    res = {
      status: commonTest.sinon.stub().returnsThis(),
      json: commonTest.sinon.stub().returnsThis(),
    };

    statusStub = res.status;
    jsonStub = res.json;
  });

  afterEach(() => {
    commonTest.sinon.restore();
  });

  it("should return token", async () => {
    await login(req, res);

    commonTest.sinon.assert.calledOnceWithExactly(statusStub, 200);
    commonTest.sinon.assert.calledOnceWithExactly(jsonStub, {
      message: "Login successful",
      data: { token: "token" },
    });
    commonTest.sinon.assert.calledOnce(getUserByEmailAndPasswordMock);
    commonTest.sinon.assert.calledOnce(signMock);
  });

  it("should return error", async () => {
    getUserByEmailAndPasswordMock.resolves([]);

    await login(req, res);

    commonTest.sinon.assert.calledOnceWithExactly(statusStub, 401);
    commonTest.sinon.assert.calledOnceWithExactly(jsonStub, {
      message: "Invalid email or password",
    });
    commonTest.sinon.assert.calledOnce(getUserByEmailAndPasswordMock);
    commonTest.sinon.assert.notCalled(signMock);
  });
});
