const {PrismaClient} = require("@prisma/client");
const {Router, Request, Response} = require("express");
const {prismaExec} = require("../prismaErrorHandler");
const {generateJwtToken} = require("../utils/generateJwtToken");

const router = Router();
const prisma = new PrismaClient()

router.get("/", (req, res) => {
    res.send("Hello world");
})

function verifyJwtToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(403).json({"error": "Access denied, no token found"});
    try {
        const decoded = jwt.verify(token, jwtTokenSecret);
        req.userInfo = decoded;
        next();
    } catch (error) {
        console.log(error.message);
        return res.status(403).json({"error": "Access denied, token error"})
    }
    return
}

router.post("/signup", async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    if (!username || !password || !email) {
        return res.status(500).json({"message": "One or more required information is missing"})
    }
    username = username.trim();
    email = email.trim();
    password = password.trim();
    const getUsersTransaction = await prismaExec(() => prisma.user.findUnique({where: {email: email}}));
    if (getUsersTransaction.transactionResponse) {
        return res.status(500).json({"message": "An account with that email already exists"})
    }
    // user doesnt exist
    const addUserTransaction = await prismaExec(() => prisma.user.create({
        data: {
            email: email,
            username: username,
            password: password
        }
    }))
    return res.send(addUserTransaction);
})
router.post("/login", async (req, res) => {
    let password = req.body.password;
    let email = req.body.email;
    if (!password || !email) {
        return res.status(500).json({"message": "One or more required information is missing"})
    }
    email = email.trim();
    password = password.trim();
    // get the user from db
    const getUserTransaction = await prismaExec(() => prisma.user.findUnique({where: {email: email}}))
    if (!getUserTransaction.transactionResponse) {
        return res.status(500).json({"message": "Account not found"})
    }
    let userInfo = getUserTransaction.transactionResponse
    userInfo = {"id": userInfo.id, "username": userInfo.username, "email": userInfo.email}
    const token = generateJwtToken(userInfo);
    return res.json({"status": "Success", "token": token});
})

module.exports = {router};