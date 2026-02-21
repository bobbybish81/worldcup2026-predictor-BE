import { Router } from "express";
import auth from "../middleware/auth.js";
import { submitKnockoutPrediction } from "../controllers/knockoutPrediction.controller.js";

const router = Router();

router.post("/", auth, submitKnockoutPrediction);

export default router;
