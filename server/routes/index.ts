import { Router } from "express";
import albumRoutes from "./albums";
import trackRoutes from "./tracks";

const router = Router();

router.use(albumRoutes);
router.use(trackRoutes);

export default router;