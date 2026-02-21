import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  getMyQualifiedTeams,
  getMyRoundOf32, getMyRoundOf16, getMyQuarterFinals,getMySemiFinals, getMyFinal
} from "../controllers/knockout.controller.js";

const router = Router();

router.get("/qualified", auth, getMyQualifiedTeams);
router.get("/round-of-32", auth, getMyRoundOf32);
router.get("/round-of-16", auth, getMyRoundOf16);
router.get("/quarter-finals", auth, getMyQuarterFinals);
router.get("/semi-finals", auth, getMySemiFinals);
router.get("/final", auth, getMyFinal);

export default router;
