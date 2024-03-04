const express = require("express");
const register = require("./register");
const login = require("./login");
const donor_profile = require("./donor_profile");
const adminLogin = require("./adminLogin");
const patientLogin = require("./patientLogin");
const patientRegister = require("./patientRegister");
const patientProfile = require("./patientProfile");
const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.post("/donor_profile", donor_profile)
router.post("/adminLogin", adminLogin)
router.post("/patientLogin",patientLogin)
router.post("/patientRegister", patientRegister)
router.post("/donor_profile", patientProfile)

module.exports = router;