const db = require("../routes/db-config");


const patientProfile = async (req,res) => {
    
    const {email, units} = req.body;

    if ( !email || !units) return res.json({ status: "error", error: "Please enter your id, email, and Units of Blood you want to donate" });
    
    else{

        const loggedInUserEmail = req.session.user && req.session.user.email;

        if (!loggedInUserEmail || email !== loggedInUserEmail) {
            return res.json({
                status: "error",
                error: "You can only make a request with the email you have logged in with.",
            });
        }
        
        db.query('select * from user where Email = ?', [email], async (err, results) => {
            if(err) throw err;
            
            if(!results || results.length === 0)return res.json({status:"error",error:"Enter a registered email"});
            
            else{
                
                db.query('select * from user, patient where user.UserID = patient.UserID and user.UserID = ?', [results[0].UserID], async (errr, result) => {
                    if(errr)throw errr;

                    db.query('insert into bloodrequest(PatientID, BloodGroup, Unit, Status) values (?, ?, ?, "Pending")',[result[0].PatientID, result[0].BloodGroup, units,],(errrorr, reslts) => {
                        if(errrorr)throw errrorr;

                        const brequest_id = reslts.insertId;

                        return res.json({status:"patientSuccess",patientSuccess:`Blood request has been sent for approval id is: ${brequest_id}`});
                    })

                    
                })
            }
        })
    }
}

module.exports = patientProfile;