import { Router } from "express";
import albumRoutes from "./albums";
import trackRoutes from "./tracks";
import adminRoutes from "./admin";
const router = Router();

router.use(albumRoutes);
router.use(trackRoutes);
router.use(adminRoutes);

export default router;