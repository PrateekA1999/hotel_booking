import { Router } from "express";
import { login } from "../Controllers/authController";
import { adminMiddleware } from "../Middlewares/authMiddleware";

const router = Router();

router.post("/login", adminMiddleware, login);

export default router;
