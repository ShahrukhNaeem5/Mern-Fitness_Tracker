const jwt = require('jsonwebtoken');

// JWT token verification middleware
const protect = (req, res, next) => {
    let token = req.headers.authorization;

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Not authorized, token missing' });
    }

    token = token.split(' ')[1]; // Get the token without the "Bearer " part

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded.userAuth;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Not authorized, token failed' });
    }
};

module.exports = { protect };
