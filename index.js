const express = require("express")
const app = express()
const multer = require("multer");
const path = require("path");
var cookieParser = require ('cookie-parser');
var session =require ('express-session');
 


app.use(cookieParser());
app.use(session({secret: "iambest"}));

const userroutes =require("./routes/users");
const ru =require("./routes/frontendrouter");
// const stripe  = require("stripe");
const stripe = require('stripe')('sk_test_51QXzeSDQNeVDcpoYpmQBXZGzNzJSiEuWLh2PCLiM5FIcTmBR8aapRy3DuyH0HZe9BcjsMTD349q1KPRrxvHOpQkI00MQZHH6h5');

app.use(function (req, res, next) {
    res.locals.loginStatus = 0
    if(req.session.userId) {
        res.locals.loginStatus=1
    }
    next();
});


app.use(express.static('public'));

app.set("view engine", "ejs")
app.set("views", ["./pages/page", "./pages/admin"]);

app.use("/" ,userroutes)

app.use("/",ru)

app.get('/success', (req, res) => {
  const booking = {
      roomName: 'Deluxe Room',
      totalPrice: '1000',
      id: 'ABC123456789',
      checkIn: '2021-12-12',
      checkOut: '2021-12-15',
  };

  res.render('success', { booking });
});







app.listen(5150, console.log("server running fine"))