import { Router } from "express";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import { enterKnockoutResult } from "../controllers/knockoutResult.controller.js";

const router = Router();

router.post("/", auth, admin, enterKnockoutResult);

export default router;
