const { PrismaClient } = require("@prisma/client");
const { Router, Request, Response } = require("express");
const { prismaExec } = require("../prismaExec");
const { generateJwtToken } = require("../utils/generateJwtToken");
const { DateTime } = require("luxon");
const { getUserTz } = require("../utils/getUserTz");
const jwt = require("jsonwebtoken");
const { isNewDay } = require("../utils/isNewDay");

const router = Router();
const prisma = new PrismaClient()
const jwtTokenSecret = process.env.TOKEN_SIGN

router.get("/", (req, res) => {
    res.send("Hello world");
})

function verifyJwtToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(403).json({ "error": "Access denied, no token found" });
    try {
        const decoded = jwt.verify(token, jwtTokenSecret);
        req.userInfo = decoded;
        next();
    } catch (error) {
        console.log(error.message);
        return res.status(403).json({ "error": "Access denied, token error" })
    }
    return
}

router.post("/signup", async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    const surveyCompletedTime = DateTime.now().minus({ days: 2 }).toUTC();
    if (!username || !password || !email) {
        return res.status(500).json({ "message": "One or more required information is missing" })
    }
    username = username.trim();
    email = email.trim();
    password = password.trim();
    const getUsersTransaction = await prismaExec(() => prisma.user.findUnique({ where: { email: email } }));
    if (getUsersTransaction.transactionResponse) {
        return res.status(500).json({ "message": "An account with that email already exists" })
    }
    // user doesnt exist
    const addUserTransaction = await prismaExec(() => prisma.user.create({
        data: {
            email: email,
            username: username,
            password: password,
            surveyCompletedTime: surveyCompletedTime,
            lastlogCompletedTime: surveyCompletedTime
        }
    }))
    return res.send(addUserTransaction);
})
router.post("/login", async (req, res) => {
    let password = req.body.password;
    let email = req.body.email;
    if (!password || !email) {
        return res.status(500).json({ "message": "One or more required information is missing" })
    }
    email = email.trim();
    password = password.trim();
    // get the user from db
    const getUserTransaction = await prismaExec(() => prisma.user.findUnique({ where: { email: email } }))
    if (!getUserTransaction.transactionResponse) {
        return res.status(500).json({ "message": "Account not found" })
    }
    let userInfo = getUserTransaction.transactionResponse
    userInfo = { "id": userInfo.id, "username": userInfo.username, "email": userInfo.email }
    const token = generateJwtToken(userInfo);
    return res.json({ "status": "Success", "token": token });
})

router.get("/dailysurveys/", verifyJwtToken, async (req, res) => {
    const uid = req.userInfo.id;
    const dailySurveysTransaction = await prismaExec(() => prisma.dailySurveys.findMany({ where: { ownerId: uid } }))
    if (dailySurveysTransaction.status === "Error" || !dailySurveysTransaction.transactionResponse) {
        return res.status(500).json({ "message": "Failed to get daily surveys" })
    }
    return res.send(dailySurveysTransaction.transactionResponse);
})

router.post("/dailysurvey/new/", verifyJwtToken, async (req, res) => {
    const uid = req.userInfo.id;
    let rating = req.body.rating;
    let mood = req.body.mood;
    let anxietyReason = req.body.anxietyReason;
    const surveyCompletedTime = DateTime.now().setZone("utc").toJSDate();
    // checks
    if (!rating || !mood || !anxietyReason) { return res.status(500).json({ "message": "Missing request info" }) }
    if (mood.length > 50 || anxietyReason.length > 50) { return res.status(500).json({ "message": "Data size too large" }) }

    // check alr submitted
    const userTransaction = await prismaExec(() => prisma.user.findUnique({ where: { id: uid } }));
    if (!userTransaction.transactionResponse) { return res.status(500).json({ "message": "User not found" }) }
    if (!isNewDay(userTransaction.transactionResponse.userTimeZone, userTransaction.transactionResponse.surveyCompletedTime)) {
        return res.status(500).json({ "message": "You've already completed this survey!" });
    }

    // submit and update user profile
    const updateUserTransaction = await prismaExec(() => prisma.user.update({ where: { id: uid }, data: { surveyCompletedTime: surveyCompletedTime } }));
    const updateHistoryTransaction = await prismaExec(() => prisma.dailySurveys.create({ data: { ownerId: uid, rating: rating, mood: mood, anxietyReason: anxietyReason } }));
    if (updateUserTransaction.status === "Error" || updateHistoryTransaction.status === "Error") {
        return res.status(500).json({ "message": "An error occurred while writing survey results to database" });
    }
    return res.send(updateHistoryTransaction);
})

router.get("/logs/", verifyJwtToken, async (req, res) => {
    const uid = req.userInfo.id;
    const logsTransaction = await prismaExec(() => prisma.dailyLogs.findMany({ where: { ownerId: uid } }))
    if (logsTransaction.status === "Error" || !logsTransaction.transactionResponse) {
        return res.status(500).json({ "message": "Failed to get daily surveys" })
    }
    return res.send(logsTransaction.transactionResponse);
})

router.post("/logs/new/", verifyJwtToken, async (req, res) => {
    const uid = req.userInfo.id;
    let title = req.body.title;
    let content = req.body.content;
    const lastlogCompletedTime = DateTime.now().setZone('utc').toJSDate();
    if (!title) {
        return res.status(500).json({ "message": "A title is required" })
    }
    title = title.trim();
    content = content.trim();
    if (title.length > 200 || content.length > 1000) {
        return res.status(500).json({ "message": `Log exceeds max text size. Max Requirements: title - 200 characters, content - 1000 characters (title: ${title.length})(content:${content.length})` })
    }
    // check log already done today
    const userTransaction = await prismaExec(() => prisma.user.findUnique({ where: { id: uid } }));
    if (!userTransaction.transactionResponse) { return res.status(500).json({ "message": "User not found" }) }
    if (!isNewDay(userTransaction.transactionResponse.userTimeZone, userTransaction.transactionResponse.lastlogCompletedTime)) {
        return res.status(500).json({ "message": "You've already completed a log today!" });
    }
    // update log and user profile
    const updateUserTransaction = await prismaExec(() => prisma.user.update({ where: { id: uid }, data: { lastlogCompletedTime: lastlogCompletedTime } }));
    const updateLogTransaction = await prismaExec(() => prisma.dailyLogs.create({ data: { ownerId: uid, title: title, content: content } }));
    if (updateUserTransaction.status === "Error" || updateLogTransaction.status === "Error") {
        return res.status(500).json({ "message": "An error occurred while writing survey results to database" });
    }
    return res.send(updateLogTransaction);
})


module.exports = { router };