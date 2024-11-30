import express from "express";
import cors from "cors";
import { router } from "./router"; 
import dotenv from "dotenv"
dotenv.config()
const app = express();

app.use(cors({
    origin: "*",
}));
app.use(express.json())
app.get("/", (req, res) => {
    res.send("API server is running");
});
app.use("/api/v1", router);
app.listen(8001, () => {
    console.log("API server running at http://localhost:8001");
});
