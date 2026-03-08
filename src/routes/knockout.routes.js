import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  getMyQualifiedTeams, getKnockoutRound
  // getMyRoundOf32, getMyRoundOf16, getMyQuarterFinals,getMySemiFinals, getMyFinal
} from "../controllers/knockout.controller.js";

const router = Router();

router.get("/qualified", auth, getMyQualifiedTeams);
router.get("/:round", auth, getKnockoutRound);

export default router;