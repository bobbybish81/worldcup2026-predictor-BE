import { Router } from "express";
import auth from "../middleware/auth.js";
import { submitKnockoutPrediction, getMyKnockoutPredictions } from "../controllers/knockoutPrediction.controller.js";

const router = Router();

router.post("/", auth, submitKnockoutPrediction);
router.get("/:round", auth, getMyKnockoutPredictions);

export default router;