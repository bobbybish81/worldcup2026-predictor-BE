import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import matchRoutes from "./routes/match.routes.js";
import predictionRoutes from "./routes/prediction.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";
import groupRoutes from "./routes/group.routes.js";
import knockoutRoutes from "./routes/knockout.routes.js";
import knockoutPredictionRoutes from "./routes/knockoutPrediction.routes.js";
import knockoutResultRoutes from "./routes/knockoutResult.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/matches", matchRoutes);
app.use("/predictions", predictionRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/groups", groupRoutes);
app.use("/knockout", knockoutRoutes);
app.use("/knockout-predictions", knockoutPredictionRoutes);
app.use("/knockout-results", knockoutResultRoutes);

export default app;
