const jwt = require("jsonwebtoken");
const db = require("../routes/db-config");

const adminLogin = async (req, res) => {
    const { id, email, password } = req.body;
    if (!id || !email || !password) return res.json({ status: "error", error: "Please enter your id, email, and password" });

    else {
        db.query('SELECT * FROM user WHERE Email = ? AND UserID = ? AND Password = ?', [email, id, password], async (err, result) => {
            
            if (err) throw err;

            if (!result.length || password !== result[0].Password) {
                return res.json({ status: "error", error: "Incorrect id, email or password" });
            }

            const token = jwt.sign({ id: result[0].UserID }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES,
            });

            const cookieOptions = {
                expiresIn: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };

            res.cookie("userRegistered", token, cookieOptions);
            return res.json({ status: "AdminSuccess", AdminSuccess: "Admin has been logged in" });
        });
    }
}

module.exports = adminLogin;
