const path = require("path");
const express = require("express");
const session = require("express-session");
const db = require("../connectivity/routes/db-config");
const app = express();
const cookie = require("cookie-parser");
const PORT = process.env.PORT || 5000; 

app.use(session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, 
}));

//app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/js", express.static(path.join(__dirname, "public/js")));
app.use("/css", express.static(path.join(__dirname, "public/css")));

/*app.use("/js", express.static(__dirname + "/public/js"));
app.use("/css", express.static(__dirname + "/public/css"));
*/
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); //app.set("views","./views");
app.use(cookie());
app.use(express.json());
db.connect((err)=> {
    if(err) throw err;
})

app.use("/", require("./routes/pages"));
app.use("/api", require("./controllers/auth"));
app.listen(PORT);