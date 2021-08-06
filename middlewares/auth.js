const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        req.isAuth = false;
        return res.status(401).send("Unauthorized");
    }

    const token = authHeader.split(' ')[1];

    if (!token || token == '') {
        req.isAuth = false;
        return res.status(401).send("Unauthorized");
    }

    let decodedToken;

    try {
        decodedToken = jwt.verify(token, process.env.JWT_KEY);
    } catch (error) {
        req.isAuth = false;
        return res.status(401).send("Unauthorized");
    }

    if (!decodedToken) {
        req.isAuth = false;
        return res.status(401).send("Unauthorized");
    }

    let { _id } = decodedToken

    req.isAuth = true;
    req.userId = _id;
    req.token = token;
    next();
}