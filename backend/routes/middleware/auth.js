const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'Token nahi hai, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token valid nahi hai' });
    }
};

// 'organizerOnly' middleware ki ab zaroorat nahi.

module.exports = { protect };

