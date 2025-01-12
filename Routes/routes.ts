import { Router } from "express";

import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import hotelRoutes from "./hotelRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/hotel", hotelRoutes);

export default router;
