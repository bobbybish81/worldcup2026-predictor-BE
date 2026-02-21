import { Router } from "express";
import auth from "../middleware/auth.js";
import { getMyGroupTables } from "../controllers/group.controller.js";

const router = Router();

router.get("/my", auth, getMyGroupTables);

export default router;
