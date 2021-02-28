const jwt = require("jsonwebtoken");

function isLoggedIn(req,res,next){
    const token = req.header("Token");
    if(!token) return res.status(401).json({Message:'AccessDenied'});
    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified._id;
        next();
    }
    catch (err){
        res.status(401).json({Error:"Invalid token"})
    }
}
module.exports.isLoggedIn = isLoggedIn;