import { Router } from "express";

import userController from "../Controllers/userController";

import {
  validatePassword,
  validateUserActiveStatus,
  validateUserCreation,
  validateUserUpdate,
} from "../Middlewares/userMiddlerware";
import { authMiddleware } from "../Middlewares/authMiddleware";

const router = Router();

router.post("/", validateUserCreation, userController.createUser);
router.put(
  "/:id",
  authMiddleware,
  validateUserUpdate,
  userController.updateUser
);
router.patch(
  "/:id/active",
  authMiddleware,
  validateUserActiveStatus,
  userController.userActiveStatusUpdate
);
router.get("/:id", authMiddleware, userController.getUser);
router.put(
  "/:id/password/change",
  authMiddleware,
  validatePassword,
  userController.changePassword
);

export default router;
