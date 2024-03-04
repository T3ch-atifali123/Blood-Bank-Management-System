const db = require("../routes/db-config");
const bcrypt = require("bcryptjs");
//const donor_id = generateDonorId();

const register = async (req, res) => {
    const { first_name, last_name, blood_type, email, phoneNum, disease, password } = req.body;

    if (!first_name || !last_name || !blood_type || !email || !phoneNum || !password) {
        return res.json({ status: "error", error: "Please Enter your name, blood type, email, phone number, disease and password" });
    } 
    
    if (password.length !== 5 || !/\d/.test(password)) {
        return res.json({ status: "error", error: "Password should be exactly 5 characters long and contain at least 1 digit" });
    }
    
    if (phoneNum.length !== 10) {
        return res.json({ status: "error", error: "Please enter a 10-digit phone number" });
    }
    
    else {
        // Check if the email already exists
        db.query('SELECT * FROM user WHERE Email = ?', [email], async (err, result) => {
            if (err) {
                throw err;
            }

            if (result.length > 0) {
                return res.json({ status: "error", error: "Email has already been registered as a donor" });
            } else {
                // Insert new user
                db.query('INSERT INTO user (Password, Email, PhoneNumber, UserType) VALUES (?, ?, ?, ?)',
                    [password, email, phoneNum, "Donor"], (error, results) => {
                        if (error) {
                            throw error;
                        }

                        // Get the UserID of the newly inserted user
                        const userId = results.insertId;

                        db.query('INSERT INTO donor (UserID, First_Name, Last_Name, Blood_Group, Last_Donation_Date, Disease) VALUES (?, ?, ?, ?, ?, ?)',
                            [userId, first_name, last_name, blood_type, new Date(), disease], (errrorr, reslts) => {
                                if (errrorr) {
                                    throw errrorr;
                                }

                                const donorId = reslts.insertId;

                                return res.json({ status: "success", success: `Donor has been registered and the Donor ID is: ${donorId}` });
                            });
                    });
            }
        });
    }
}

module.exports = register;
