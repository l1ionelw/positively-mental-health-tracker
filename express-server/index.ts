import express, {Request, Response} from "express";
import dotenv from "dotenv";
import {router as apiRouter} from "./routes/api";

dotenv.config();
const PORT = 3000;
const app = express();

app.use("/api", apiRouter);


app.get("/", (req: Request, res: Response) => {
    res.send("Hello world");
});

app.listen(PORT, "10.8.0.6",()=>{
    console.log("Server is running at port: " + PORT);
})