import { Router } from "express";
import auth from "../middleware/auth.js";
import { getKnockoutRound } from "../controllers/knockout.controller.js";

const router = Router();

router.get("/:round", auth, getKnockoutRound);

export default router;