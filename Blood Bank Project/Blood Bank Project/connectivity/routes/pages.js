const express = require("express");
const loggedIn = require("../controllers/loggedin");
const logout = require("../controllers/logout");
const donor_profile = require("../controllers/donor_profile");
const patientProfile = require("../controllers/patientProfile");
const db = require("../routes/db-config"); 

const router = express.Router();

router.get("/", loggedIn, (req, res) => {
    if (req.user) {
        let requestStatus;
        const donorId = req.user.UserID;

        console.log(req.user);

        db.query('select * from donationrequest dr, donor d, user u where u.UserID = d.UserID and d.DonorID = dr.DonorID and u.UserID = ?;', [donorId], (error, results) => {
            if (error) throw error;


            if (results[0] && results[0].UserType === "Donor") {
                req.session.bloodGroup = results[0].BloodGroup;
                req.session.unit = results[0].Unit;
            }

            const donationStatus = results[0] ? results[0].Status : "No donation request";
            

            // Check if the user is an admin
            if (req.user && req.user.UserType === 'Admin') {
                console.log("Identified that the user is an admin");
                db.query('select * from admin, user where admin.UserID = user.UserID and user.UserID = ?;',[req.user.UserID], (err,result) => {
                    if (err) throw err; 
                    req.session.adminId = result[0].AdminID;
                    //console.log("The admin id is: ");
                    //console.log(result[0].AdminID);

                    // Render admin.ejs for admin users
                    res.render("admin", { status: "adminLoggedIn", user: req.user });
                });
            } else if (req.user && req.user.UserType === 'Patient') {
                db.query('select * from bloodrequest br, patient p, user u where u.UserID = p.UserID and p.PatientID = br.PatientID and u.UserID = ?;', [donorId], (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ status: "error", error: "Internal server error." });
                    }
            
                    if (!result || result.length === 0) {
                        // No blood requests for the patient
                        console.log("Identified that the user is a patient");
                        return res.render("patient", { status: "patientLoggedIn", user: req.user, requestStatus: "No donation request" });
                    }
            
                    // Handle the case when the patient has blood requests
                    req.session.patientBloodGroup = result[0].BloodGroup;
                    req.session.patientUnit = result[0].Unit;
                    console.log("The patient blood group is:");
                    console.log(req.session.patientBloodGroup);
                    const requestStatus = result[0].Status || "No donation request";
                    console.log("The request status is:");
                    console.log(requestStatus);
            
                    res.render("patient", { status: "patientLoggedIn", user: req.user, requestStatus });
                });
            } else {
                // Render index.ejs for donors
                res.render("donor", { status: "loggedIn", user: req.user, donationStatus });
            }
        });
    } else {
        res.render("index", { status: "no", user: "nothing" });
    }
});


router.get("/register", (req, res) => {
    res.sendFile("register.html", { root: "./public" });
});

router.get("/patientRegister", (req, res) => {
    res.sendFile("patientRegister.html", { root: "./public" });
});


router.get("/admin", (req, res) => {
    if (req.user && req.user.User_type === 'Admin') {
        console.log("Inside /admin");
    res.render("admin", { status: "ok", user: req.user });    
    //res.sendFile("admin.ejs", { root: "./views" });
    } else {
        res.redirect("/adminLogin");
    }
});

router.get("/donor", (req, res) => {
    if (req.user && req.user.User_type === 'Donor') {
        console.log("Inside /donor");
    res.render("donor", { status: "ok", user: req.user });    
    //res.sendFile("admin.ejs", { root: "./views" });
    } else {
        res.redirect("/login");
    }
});

router.get("/patient", (req, res) => {
    if (req.user && req.user.User_type === 'Patient') {
        console.log("Inside /patient");
    res.render("patient", { status: "ok", user: req.user });    
    //res.sendFile("admin.ejs", { root: "./views" });
    } else {
        res.redirect("/patientLogin");
    }
});

router.post("/adminLogin", (req, res) => {

    if (req.user && req.user.User_type === 'Admin') {
        console.log("Inside /adminLogin");
        res.render("admin", { status: "adminLoggedIn", user: req.user });
    } else {

        res.redirect("/adminLogin"); 
    }
});

router.post("/patientLogin", (req, res) => {

    if (req.user && req.user.User_type === 'Patient') {
        console.log("Inside /patientLogin");
        res.render("patient", { status: "patientLoggedIn", user: req.user });
    } else {

        res.redirect("/patientLogin"); 
    }
});

router.get("/login", (req, res) => {
    res.sendFile("login.html", { root: "./public" });
});

router.get("/adminLogin", (req, res) => {
    res.sendFile("adminLogin.html", { root: "./public" });
});

router.get("/patientLogin", (req, res) => {
    res.sendFile("patientLogin.html", { root: "./public" });
});

router.post("/donor_profile", donor_profile);


router.get("/donor_profile", (req, res) => {
    res.sendFile("donor_profile.html", { root: "./public" });
});

router.post("/patientProfile", patientProfile);

router.get("/patientProfile", (req, res) => {
    res.sendFile("patientProfile.html", { root: "./public" });
});

router.post("/admin_profile", donor_profile);

router.get("/admin_profile", (req, res) => {
    res.sendFile("admin_profile.html", { root: "./public" });
});


router.get("/donation_status", loggedIn, (req, res) => {
    
    const donorId = req.user.UserID; 
    db.query('select * from donationrequest dr, donor d, user u where u.UserID = d.UserID and d.DonorID = dr.DonorID and u.UserID = ?;', [donorId], (error, results) => {
        if (error) throw error;

        const donationStatus = results[0] ? results[0].Status : "No donation request";

        res.render("index", { status: "loggedIn", user: req.user, donationStatus });
    });
});

router.get("/request_status", loggedIn, (req, res) => {

    const patientId = req.user.UserID; 
    db.query('select * from bloodrequest br, patient p, user u where u.UserID = p.UserID and p.PatientID = br.PatientID and u.UserID = ?;', [patientId], (error, results) => {
        if (error) throw error;

        const requestStatus = results[0] ? results[0].Status : "No Blood Request";

        res.render("patient", { status: "patientLoggedIn", user: req.user, requestStatus });
    });
});

router.get("/admin/blood_requests", loggedIn, (req, res) => {
    
    db.query('SELECT * FROM bloodrequest WHERE Status = "Pending";', (error, results) => {
        if (error) {
            console.error("Error fetching blood requests:", error);
            return res.status(500).json({ error: "Internal server error" });
        }

        console.log(results);

        res.json({ bloodRequests: results });
    });
});

router.post("/admin/approve_blood_request/:id", (req, res) => {
    const requestId = req.params.id;
    const adminId = req.session.adminId;

    // Retrieve information from the database based on the request ID
    db.query('SELECT BloodGroup, Unit FROM bloodrequest WHERE BrequestID = ?', [requestId], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error." });
        }

        if (!result || result.length === 0) {
            return res.status(404).json({ error: "Blood request not found." });
        }

        const patientBloodGrp = result[0].BloodGroup;
        const patientUnit = result[0].Unit;

        db.query('SELECT BloodStockID from bloodstock where BloodGroup = ?',[patientBloodGrp], (errr, result) => {
            if (errr) {
                console.error(errr);
                return res.status(500).json({ error: "Internal server error." });
            }

            const patientBloodStockID = result[0].BloodStockID;
            console.log("The bloodstock id is: ");
            console.log(patientBloodStockID);

            db.query('UPDATE bloodrequest SET Status = "Approved", AdminID = ? WHERE BrequestID = ?', [adminId, requestId], (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: "Internal server error." });
                }
    
                db.query('CALL update_bloodstock(?, ?, @message)', [patientBloodStockID, patientUnit], (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ error: "Internal server error." });
                    }
    
                    db.query('SELECT @message AS message', (errr, result) => {
                        if (errr) {
                            console.error(errr);
                            return res.status(500).json({ error: "Internal server error." });
                        }
    
                        const message = result[0].message;
                        console.log('Message from stored procedure:', message);
                        res.json({ message: "Blood Request approved successfully" });
                    });
                });
            });

        });
        
    });
});


router.post("/admin/reject_blood_request/:id", (req, res) => {
    const requestId = req.params.id;

    db.query('delete from bloodrequest WHERE BrequestID = ?', [requestId], (error, results) => {
        if (error) throw error;


        res.json({ message: "Blood Request rejected successfully" });
    });
});


router.get("/admin/donation_requests", (req, res) => {

    db.query('SELECT * FROM donationrequest where Status = "Pending";', (error, results) => {
        if (error) throw error;

        res.json({ donationRequests: results });
    });
});

router.post("/admin/approve_donation_request/:id", (req, res) => {
    const requestId = req.params.id;
    const adminId = req.session.adminId;

    db.query('SELECT BloodGroup, Unit FROM donationrequest WHERE DrequestID = ?', [requestId], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error." });
        }

        if (!result || result.length === 0) {
            return res.status(404).json({ error: "Donation request not found." });
        }

        const BloodGrp = result[0].BloodGroup;
        const unit = result[0].Unit;

        db.query('SELECT BloodStockID from bloodstock where BloodGroup = ?',[BloodGrp], (errr, result) => {
            if (errr) {
                console.error(errr);
                return res.status(500).json({ error: "Internal server error." });
            }

            const DonorBloodStockID = result[0].BloodStockID;
            console.log("The bloodstock id is: ");
            console.log(DonorBloodStockID);

            db.query('UPDATE donationrequest SET Status = "Approved", AdminID = ? WHERE DrequestID = ?', [adminId, requestId], (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: "Internal server error." });
                }
    
                db.query('UPDATE bloodstock SET Unit = Unit + ? WHERE BloodStockID = ?', [unit, DonorBloodStockID], (err,result) => {
                    if (err) throw err;

                    res.json({ message: "Request approved successfully" });

                });
            });

        });
        
    });
});


router.post("/admin/reject_donation_request/:id", (req, res) => {
    const requestId = req.params.id;

    
    db.query('UPDATE donationrequest SET Status = "Rejected" WHERE DrequestID = ?', [requestId], (error, results) => {
        if (error) throw error;

        
        res.json({ message: "Request rejected successfully" });
    });
});

router.get("/admin/admin_data", (req, res) => {

    db.query('select * from bloodstock', (error, results) => {
        if (error) throw error;

        
        res.json({ adminData: results });
    });
});

router.get("/admin/donor_count", (req, res) => {

    db.query('select count(*) from donor', (error, results) => {
        if (error) throw error;

        
        res.json({ adminData: results });
    });
});

router.get("/admin/request_count", (req, res) => {

    db.query('select count(*) from donationrequest', (error, results) => {
        if (error) throw error;

        
        res.json({ adminData: results });
    });
});

router.get("/admin/approved_request_count", (req, res) => {

    db.query('select count(*) from donationrequest where Status = "Approved" ', (error, results) => {
        if (error) throw error;

        
        res.json({ adminData: results });
    });
});

router.get("/admin/patient_count", (req, res) => {

    db.query('select count(*) from patient', (error, results) => {
        if (error) throw error;

        
        res.json({ adminData: results });
    });
});

router.get("/logout", logout);

module.exports = router;
