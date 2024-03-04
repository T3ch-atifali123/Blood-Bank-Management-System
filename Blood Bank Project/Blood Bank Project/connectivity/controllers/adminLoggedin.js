const db = require("../routes/db-config");
const jwt = require("jsonwebtoken");

const adminLoggedIn = (req, res, next) => {
    if (!req.cookies.userRegistered) {
        return next();
    }

    try {
        const decoded = jwt.verify(req.cookies.userRegistered, process.env.JWT_SECRET);
        db.query('select * from user where UserID = ?', [decoded.id], (err, result) => {
            if (err || result.length === 0) {
                return next();
            }

            const user = result[0];

            if (user.UserType === 'Admin') {
                req.user = user;
                req.status = 'adminLoggedIn';
            }

            return next();
        });
    } catch (err) {
        return next();
    }
};

module.exports = adminLoggedIn;
