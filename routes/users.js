const express = require('express')
const userRoutes = express.Router()
const mongoose = require('mongoose');
const users = require("../pages/models/users")
const rooms = require("../pages/models/rooms")
const booking = require("../pages/models/booking")
const newusers = require("../pages/models/newusers")
const multer = require("multer");
const nodemailer = require('nodemailer');
const path = require("path");
const bodyParser = require('body-parser');
const stripe = require('stripe')('sk_test_51QXzeSDQNeVDcpoYpmQBXZGzNzJSiEuWLh2PCLiM5FIcTmBR8aapRy3DuyH0HZe9BcjsMTD349q1KPRrxvHOpQkI00MQZHH6h5');

const { console } = require('inspector');
// support parsing of userRouteslication/json type post data
userRoutes.use(bodyParser.json());

//support parsing of userRouteslication/x-www-form-urlencoded post data
userRoutes.use(bodyParser.urlencoded({ extended: true }));

mongoose
    .connect('mongodb://localhost:27017/Blog');

// Handle connection events
const db = mongoose.connection;
db
    .on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Replace with your provider's SMTP server
    port: 587, // Port may vary depending on your provider
    secure: false, // Use true for TLS, false for non-TLS (consult your provider)
    auth: {
        user: 'anish050104@gmail.com', // Replace with your email address
        pass: 'ijaq yybj yzzj zffo' // Replace with your email password
    }
});


let auth = function (req, res, next) {
    if (req.session.user)
        return next();
    else
        return res.redirect("/login");
};

userRoutes.get("/loginCheck", (req, res, next) => {
    if (req.session.user) {
        res.redirect("/adminHome")
    } else {
        next();
    }
},
    (req, res) => {
        res.render("login")
    })





// userRoutes.get("/adminhome",(req,res)=>{
//     res.render("adminhome")
// })

userRoutes.get("/tabs_panels", (req, res) => {
    res.render("tabs_panels")
})

userRoutes.get("/notifications", (req, res) => {
    res.render("notificatios")
})
userRoutes.get("/progress", (req, res) => {
    res.render("progress")
})
userRoutes.get("/buttons", (req, res) => {
    res.render("buttons")
})
userRoutes.get("/icons", (req, res) => {
    res.render("icons")
})
userRoutes.get("/wizard", (req, res) => {
    res.render("wizard")
})

userRoutes.get("/typography", (req, res) => {
    res.render("typography");
});

userRoutes.get("/grid", (req, res) => {
    res.render("grid");
});

userRoutes.get("/invoice", (req, res) => {
    res.render("invoice");
});

userRoutes.get("/pricing", (req, res) => {
    res.render("pricing");
});

userRoutes.get("/component", (req, res) => {
    res.render("component");
});

userRoutes.get("/social", (req, res) => {
    res.render("social");
});

userRoutes.get("/messages_task", (req, res) => {
    res.render("messages_task");
});

userRoutes.get("/table", (req, res) => {
    res.render("table");
});

userRoutes.get("/form", (req, res) => {
    res.render("form")
})

userRoutes.post("/form", (req, res) => {
    let postData = new users(req.body)
    postData.save()
    res.redirect("/form")
    console.log(req.body)
})

userRoutes.get("/gallery", (req, res) => {
    res.render("gallery");
});

userRoutes.get("/error", (req, res) => {
    res.render("error");
});

userRoutes.get("/login", (req, res) => {
    res.render("login");
});

userRoutes.get("/blank", (req, res) => {
    res.render("blank");
});


userRoutes.get("/form", (req, res) => {
    res.render("form")
})

userRoutes.get("/form", (req, res) => {
    let postData = new users(req.body)
    postData.save()
    res.redirect("/form")
    console.log(req.body)
})

userRoutes.get("/allusers", (req, res) => {
    console.log(req.query)
    users.find().then((users) => {
        // res.json(user)
        res.render("allusers", { d: users, msg: req.query.msg })
    })
    // res.render("allusers")
})


userRoutes.get("/edit/:id", (req, res) => {
    users.findOne({ _id: req.params.id }).then((user) => {
        if (user) {
            console.log(user)
            res.render("edit", { user: user });
        } else {
            res.status(404).send("User not found");
        }
    }).catch((err) => {
        res.status(500).send("Error retrieving user");
    });
    //res.render("edit"); 
});

userRoutes.post("/edit/:id", (req, res) => {
    //console.log("working")
    users.findOneAndUpdate({ _id: req.params.id }, req.body).then(() => { res.redirect("/allusers?msg=add") })
})

userRoutes.get("/view/:id", (req, res) => {

    users.findById(req.params.id).then((view) => {
        if (view) {
            res.render("view", { view: view });
        } else {
            res.status(404).send("User not found");
        }
    }).catch((err) => {
        res.status(500).send("Error retrieving user");
    });
});

userRoutes.get("/deleteUser/:id", (req, res) => {
    users.findOneAndDelete({ _id: req.params.id }).then(() => {
        res.redirect("/allusers?msg=delete");
    })
})

userRoutes.get("/register", (req, res) => {
    res.render("register");
});


userRoutes.post("/register", (req, res) => {
    let postData = new newusers({ ...req.body, status: 0 });
    postData.save().then(() => {
        res.redirect("/register");
    })
        .catch((err) => {
            res.status(500).send("Error registering user");
        });
});

userRoutes.get("/approved", (req, res) => {
    console.log(req.query)
    newusers.find().then((newusers) => {
        res.render("approved", { i: newusers, msg: req.query.msg })
    })
})

userRoutes.get("/approved/:id", (req, res) => {
    newusers.findOne({ _id: req.params.id }).then((d) => {
        if (d.status == 0) {
            newusers.findOneAndUpdate({ _id: req.params.id }, { status: 1 }).then((k) => {
                res.redirect("/approved")
            })
        } else {
            newusers.findOneAndUpdate({ _id: req.params.id }, { status: 0 }).then((z) => {
                res.redirect("/approved")
            })
        }
    })
});


userRoutes.get("/user2/:id", (req, res) => {

    newusers.findById(req.params.id).then((user2) => {
        if (user2) {
            res.render("user2", { user2: user2 });
        } else {
            res.status(404).send("User not found");
        }
    }).catch((err) => {
        res.status(500).send("Error retrieving user");
    });
});

userRoutes.get("/edit2/:id", (req, res) => {
    newusers.findOne({ _id: req.params.id }).then((user2) => {
        if (user2) {
            console.log(user2)
            res.render("edit2", { user2: user2 });
        } else {
            res.status(404).send("User not found");
        }
    }).catch((err) => {
        res.status(500).send("Error retrieving user");
    });
    //res.render("edit"); 
});

userRoutes.post("/edit2/:id", (req, res) => {
    //console.log("working")
    newusers.findOneAndUpdate({ _id: req.params.id }, req.body).then(() => { res.redirect("/approved?msg=edit2") })
})

userRoutes.get("/delete2/:id", (req, res) => {
    newusers.findOneAndDelete({ _id: req.params.id }).then(() => {
        res.redirect("/approved?msg=del");
    })
})

userRoutes.get('/login', function (req, res) {
    res.render('login');
    // console.log(req.session)
});


userRoutes.post("/loginCheck", function (req, res) {
    users.findOne({ name: req.body.name, password: req.body.password }).then((d) => {
        if (d === null) {
            res.send("wrong credential! please check and correct them")
        }
        else {
            req.session.user = d.name;
            res.redirect("/adminHome")
        }
    })
})

userRoutes.get('/adminHome', auth, function (req, res) {
    res.render("adminHome")
});

userRoutes.get("/userLogout", auth, (req, res) => {
    req.session.destroy();
    res.redirect("/home")
})


userRoutes.get('/adminRoom', auth, function (req, res) {
    res.render("adminRoom");
});

userRoutes.post("/addRoom", (req, res) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            // Set the upload folder
            cb(null, "public/roomUploads");
        },
        filename: function (req, file, cb) {
            // Set filename format with unique timestamp
            cb(null, file.fieldname + "-" + Date.now() + ".jpg");
        }
    });

    // Max file size is set here to 1MB
    const maxSize = 1 * 3000 * 3000;

    const adminRoom = multer({
        storage: storage,
        limits: { fileSize: maxSize },
        fileFilter: function (req, file, cb) {
            // Validate file types (jpeg, jpg, png)
            const filetypes = /jpeg|jpg|png/;
            const mimetype = filetypes.test(file.mimetype);
            const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

            if (mimetype && extname) {
                return cb(null, true);
            }
            cb("Error: File upload only supports the following filetypes - " + filetypes);
        }
    }).single("roompic");

    adminRoom(req, res, function (err) {
        if (err) {
            res.send(err);
        } else {
            let final = {
                ...req.body,
                roompic: req.file.filename
            };

            let u = new rooms(final);
            u.save()
                .then(() => res.send("Success, Room Image uploaded!"))
                .catch(err => res.send("Error: " + err));
        }
    });
});

userRoutes.get("/editRoom", (req, res) => {
    console.log(req.query)
    rooms.find().then((rooms) => {
        res.render("editRoom", { d: rooms, msg: req.query.msg })
    })
})

userRoutes.get("/updateRoom/:id", (req, res) => {
    rooms.findOne({ _id: req.params.id }).then((rooms) => {
        if (rooms) {
            console.log(rooms)
            res.render("updateRoom", { rooms: rooms });
        } else {
            res.status(404).send("User not found");
        }
    }).catch((err) => {
        res.status(500).send("Error retrieving user");
    });
});

userRoutes.post("/updateRoom/:id", (req, res) => {
    rooms.findOneAndUpdate({ _id: req.params.id }, req.body).then(() => {
        res.redirect("/editRoom?msg=updRoom")
    })
})


userRoutes.get("/deleteRoom/:id", (req, res) => {
    rooms.findOneAndDelete({ _id: req.params.id }).then(() => {
        res.redirect("/editRoom?msg=dltRoom");
    })
})

userRoutes.get("/viewRoom/:id", (req, res) => {

    rooms.findById(req.params.id).then((rooms) => {
        if (rooms) {
            res.render("viewRoom", { rooms: rooms });
        } else {
            res.status(404).send("User not found");
        }
    }).catch((err) => {
        res.status(500).send("Error retrieving user");
    });
});


userRoutes.get("/bookingInfo", async (req, res) => {
    try {
        console.log(req.query);

        let bookings = await booking.aggregate([
            {
                $lookup: {
                    from: "rooms", // collection to join
                    localField: "roomId", // field from the input documents
                    foreignField: "_id", // field from the documents of the "from" collection
                    as: "room_details" // output array field
                }
            },
            {
                $lookup: {
                    from: "newusers", // collection to join
                    localField: "userId", // field from the input documents
                    foreignField: "_id", // field from the documents of the "from" collection
                    as: "user_details" // output array field
                }
            }
        ]);
        bookings = bookings.map(booking => {
            booking.room_details = booking.room_details[0] || {};
            booking.user_details = booking.user_details[0] || {};
            return booking;
        });

        console.log(bookings);

        res.render("bookingInfo", { d: bookings });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});


userRoutes.post("/approve/:id", async (req, res) => {
    try {
        const bookingId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            return res.status(400).send("Invalid booking ID.");
        }

        const bookingData = await booking.findById(bookingId).populate("roomId").populate("userId");

        if (!bookingData) {
            return res.status(404).send("Booking not found.");
        }

        const checkInDate = new Date(bookingData.checkIn);
        const checkOutDate = new Date(bookingData.checkOut);
        const timeDifference = checkOutDate - checkInDate;
        const daysDifference = timeDifference / (1000 * 3600 * 24);

        if (daysDifference <= 0) {
            return res.status(400).send("Invalid check-in or check-out dates.");
        }

        const totalPrice = bookingData.roomId.price * daysDifference;

        bookingData.status = 1;
        await bookingData.save();

        const checkoutLink = `${req.protocol}://${req.get('host')}/checkout/${bookingData._id}`;

        const contactMail = {
            from: 'your_email@example.com',
            to: bookingData.userId.email,
            subject: "Booking Approved",
            html: `
                <p>Hi ${bookingData.userId.name},</p>
                <p>Your booking has been approved! Below are the details:</p>
                <ul>
                    <li>Room Name: ${bookingData.roomId.name}</li>
                    <li>Room Number: ${bookingData.roomNo}</li>
                    <li>Message: ${bookingData.message}</li>
                    <li>Check-In Date: ${checkInDate.toLocaleDateString()}</li>
                    <li>Check-Out Date: ${checkOutDate.toLocaleDateString()}</li>
                    <li>Room Price per Day: ${bookingData.roomId.price.toFixed(2)}</li>
                    <li>Total Price: ${totalPrice.toFixed(2)}</li> 
                </ul>
                <p><a href="${checkoutLink}">Click here to proceed to checkout</a></p>
                <p>Thank you for booking with us!</p>
            `,
        };

        transporter.sendMail(contactMail, (err, info) => {
            if (err) {
                console.error("Email Sending Error:", err);
                return res.status(500).send("Failed to send the approval email.");
            }

            console.log("Email Sent Successfully:", info.response);
            res.send("Booking approved and email sent successfully.");
        });
    } catch (error) {
        console.error("Error in Approve API:", error);
        res.status(500).send("An unexpected error occurred.");
    }
});



userRoutes.get("/checkout/:id", async (req, res) => {
    try {
        const bookingDoc = await booking.findOne({ _id: req.params.id })
            .populate('userId')
            .populate('roomId');

        if (!bookingDoc) {
            console.log("Booking not found");
            return res.status(404).send("Booking not found");
        }
        console.log(bookingDoc);

        res.render("checkout", { booking: bookingDoc });

    } catch (err) {
        console.error("Error in /checkout/:id route:", err);
        res.status(500).send("Internal Server Error");
    }
});



// userRoutes.post("/confirmBooking", async (req, res) => {
//     try {
//         console.log(req.body);
  
//         const { roomName, roomPrice, totalPrice } = req.body;
  
//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ['card'],
//             line_items: [
//                 {
//                     price_data: {
//                         currency: 'usd',
//                         product_data: {
//                             name: roomName,
//                         },
//                         unit_amount: Number(totalPrice) * 100, 
//                     },
//                     quantity: 1, 
//                 },
//             ], 
//             mode: 'payment',
//             success_url: 'http://localhost:5150/success',
//             cancel_url: 'http://localhost:5150/cancel',
//         });
  
//         res.redirect(303, session.url);
//     } catch (error) {
//         console.error('Error creating Stripe session:', error);
//         res.status(500).send('An error occurred');
//     } 
//   });
 


userRoutes.post("/confirmBooking", async (req, res) => {
    try {
        console.log(req.body);

        const { roomName, roomPrice, totalPrice, userEmail } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: roomName,
                        },
                        unit_amount: Number(totalPrice) * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:5150/success',
            cancel_url: 'http://localhost:5150/cancel',
        });

        const transporter = nodemailer.createTransport({
            service: 'gmail', // Use your email service
            auth: {
                user: 'anish050104@gmail.com', // Replace with your email
                pass: 'ijaq yybj yzzj zffo',    // Replace with your email password or app password
            },
        });

        // Email content
        const mailOptions = {
            from: 'your-email@example.com', // Sender address
            to: userEmail, // Recipient email
            subject: 'Booking Confirmation',
            html: `
                <h1>Booking Confirmed!</h1>
                <p>Thank you for booking with us. Here are your booking details:</p>
                <ul>
                    <li><strong>Room Name:</strong> ${roomName}</li>
                    <li><strong>Room Price:</strong> $${roomPrice}</li>
                    <li><strong>Total Price:</strong> $${totalPrice}</li>
                </ul>
                <p>We look forward to hosting you!</p>
            `,
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        res.redirect(303, session.url);
    } catch (error) {
        console.error('Error creating Stripe session:', error);
        res.status(500).send('An error occurred');
    }
});


module.exports = userRoutes