const jwt = require('jsonwebtoken')


module.exports = function (req, res, next) {
    const token = req.header('Authorization')

    if(!token){
        return res.status(401).send({
            statusCode: 401,
            message: "Token non presente"
        })
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        req.user = verified;

        next()
    } catch (error) {
        res.status(403).send({
            message: "Token scaduto o non valido",
            statusCode: 403
        })
    }
}