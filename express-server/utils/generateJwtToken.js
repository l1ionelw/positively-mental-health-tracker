const jwt = require('jsonwebtoken');

function generateJwtToken(userInfo) {
    // userinfo keys: {id, username, email}
    if (!process.env.TOKEN_SIGN) {
        return "token generation error";
    }
    console.log(process.env.TOKEN_SIGN);
    return jwt.sign(userInfo, process.env.TOKEN_SIGN, {expiresIn: '1d'});
}

module.exports = {generateJwtToken};