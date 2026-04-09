import "dotenv/config";
import express from "express";
import cors from "cors";
import taskRoutes from "./routes/tasks.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Only allow requests from your frontend origin
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/tasks", taskRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
