const db = require("../routes/db-config");


const donor_profile = async (req,res) => {
    
    const {email, units} = req.body;

    if (!email || !units) return res.json({ status: "error", error: "Please enter your id, email, and Units of Blood you want to donate" });
    
    else{


        const loggedInUserEmail = req.session.user && req.session.user.email;

        if (!loggedInUserEmail || email !== loggedInUserEmail) {
            return res.json({
                status: "error",
                error: "You can only make a request with the email you have logged in with.",
            });
        }

        console.log(email);
        db.query('select * from user where Email = ?', [email], async (err, results) => {
            if(err) throw err;
            
            if(!results || results.length === 0)return res.json({status:"error",error:"Enter a registered email"});
            
            else{
                
                console.log("The use id is: ");
                console.log(results[0].UserID);

                db.query('select * from user, donor where user.UserID = donor.UserID and user.UserID = ?', [results[0].UserID], async (err, result) => {
                    if(err)throw err;

                    console.log("The disease is: ");
                        console.log(result[0].Disease);
                        console.log("The complete data is: ");
                        console.log(result);

                    db.query('INSERT INTO donationrequest (DonorID, BloodGroup, Unit, disease, Status) VALUES (?, ?, ?, ?, "Pending")',[result[0].DonorID, result[0].Blood_Group, units, result[0].Disease],(errrorr, reslts) => {
                        if(errrorr)throw errrorr;

                    })

                    db.query('select * from donationrequest where DonorID = ?',[result[0].DonorID],(er, reslts) => {
                        if(er)throw er;

                        return res.json({status:"success",success:`Donation request has been sent for approval id is: ${reslts[0].DrequestID}`});
                    })

                    
                })
            }
        })
    }
}

module.exports = donor_profile;