const express = require("express");
const dotenv = require("dotenv");
const {router} = require("./routes/api")

dotenv.config();
const PORT = 3000;
const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", router);
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello world");
});

app.listen(PORT, ()=>{
    console.log("Server is running at port: " + PORT);
})