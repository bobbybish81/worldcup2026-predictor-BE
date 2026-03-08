import { Router } from "express";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import {
  getGroupMatches,
  enterMatchResult,
} from "../controllers/match.controller.js";

const router = Router();

router.get("/group", auth, getGroupMatches);

// ADMIN ONLY
router.post("/result", auth, admin, enterMatchResult);

router.get("/", auth, (req, res) => {
  res.json({ message: "Match routes working" });
});

router.post("/", auth, admin, (req, res) => {
  res.json({ message: "Admin match creation placeholder" });
});

export default router;