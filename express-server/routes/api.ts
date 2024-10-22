import { Router, Request, Response } from "express";

export const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.send("Hello world");
})

router.get("/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // check if the user exists, if so, return an error
    const user = await prisma.user.findUnique({
        where: {
            email: 'elsa@prisma.io',
        },
    })
})