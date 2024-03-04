const db = require("../routes/db-config");
const bcrypt = require("bcryptjs");

const patientRegister = async(req, res) => {
    const { first_name, last_name, blood_type, email, phoneNum, password } = req.body;
    if( !first_name || !last_name || !blood_type || !email || !phoneNum || !password) return res.json({status:"error",error:"Please Enter your id, name, blood type, email and password 1st hello"}); 

    else{
        db.query('select * from user where Email = ?', [email], async (err, result) => {
            if (err) {
                throw err;
            }

            if (result.length > 0) {
                return res.json({ status: "error", error: "Email has already been registered as a Patient" });
            }

            if (password.length !== 5 || !/\d/.test(password)) {
                return res.json({ status: "error", error: "Password should be exactly 5 characters long and contain at least 1 digit" });
            }
            
            if (phoneNum.length !== 10) {
                return res.json({ status: "error", error: "Please enter a 10-digit phone number" });
            }

            else{
                db.query('INSERT INTO user (Password, Email, PhoneNumber, UserType) VALUES (?, ?, ?, ?)',
                [password, email, phoneNum, "Patient"], (error, results) => {
                    if(error)throw error;

                    const userId = results.insertId;

                    db.query('INSERT INTO patient (UserID, First_Name, Last_Name, BloodGroup) VALUES (?, ?, ?, ?)',
                    [userId, first_name, last_name, blood_type],(errrorr, rslts) => {
                        if(errrorr)throw errrorr;
                    
                        const patient_id = rslts.insertId;


                        return res.json({status:"patientSuccess",success:`Patient has been registered and the Patient ID is: ${patient_id}`});
                    });
                })
            }
        })
    }
}


module.exports = patientRegister;