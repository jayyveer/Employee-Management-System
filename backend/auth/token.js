const jwt = require("jsonwebtoken")

generateToken = (key) => {
    return jwt.sign(key, "secureKey")
}

verifyToken = (req, res, next) => {
    //get auth header value send token in header
    const bearerHeader = req.headers['authorization'];
    // console.log();
    //check if bearer is undefined not undefined
    if (typeof bearerHeader !== 'undefined') {
        //split at the space
        const bearer = bearerHeader;
        //getr token from array
        const bearerToken = bearer;
        //set the token
        // console.log("bearer",bearer,"bearerheader",bearerHeader,"bearertoken",bearerToken);
        jwt.verify(req.token, "secureKey", (err, authData) => {
            // console.log(req);
            if (err) {
                console.log("Err", err);
                res.sendStatus(403)
            }
            else {
                next();
            }
        });
        // req.token = bearerToken;
    }
    else {
        //Forbidden
        res.sendStatus(403);
    }
} 
module.exports = { generateToken, verifyToken }