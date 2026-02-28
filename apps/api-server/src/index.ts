import express from "express";
import cors from "cors";
import { router } from "./router";
import dotenv from "dotenv";
dotenv.config();
const app = express();

app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json());
app.get("/", (req, res) => {
  res.send("API server is running");
});
app.use("/api/v1", router);
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});