import {Router, Request, Response} from "express";


export const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.send("Hello worlsd");
})
