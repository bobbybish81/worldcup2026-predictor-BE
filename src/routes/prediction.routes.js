import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  getMyPredictions,
  submitPrediction,
} from "../controllers/prediction.controller.js";

const router = Router();

router.get("/me", auth, getMyPredictions);
router.post("/", auth, submitPrediction);

export default router;