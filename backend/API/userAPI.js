let express = require('express')
let router = express.Router()
const knex = require('../config/db_properties')
const token = require('../auth/token')
const nodemailer = require('nodemailer')

// router.get("/", async (req, res) => {
//     // connection.query("select * from users", (err, recordsArray) => {
//     //     if (err)
//     //         res.json({ 'message': 'error' + err })
//     //     else {
//     //         // console.log('Data sent')
//     //         // console.log(recordsArray);
//     //         res.json(recordsArray)
//     //     }
//     // })
//     try {
//         const res = await knex.raw('select * from roles')
//             .catch((error) => {
//                 console.log("error", error)
//                 throw "Record Not found"
//             })
//         res.json({ "message": "Sucess in fetching details" })

//     } catch (error) {
//         console.log("Error", error);
//         res.json({ "message": `Error` })

//     }
//     // knex.from('users')
//     //     .select('*')
//     //     .then(function (resp) {
//     //         console.log("Inside", resp[0]);
//     //         // res.json({ "message": "Sucess in fetching details" })
//     //     });
// })

// verifyToken = (req, res, next) => {
//     //get auth header value send token in header
//     const bearerHeader = req.headers['authorization'];
//     // console.log();
//     //check if bearer is undefined not undefined
//     if (typeof bearerHeader !== 'undefined') {
//         //split at the space
//         const bearer = bearerHeader;
//         //getr token from array
//         const bearerToken = bearer;
//         //set the token
//         //console.log("bearer",bearer,"bearerheader",bearerHeader,"bearertoken",bearerToken);
//         req.token = bearerToken;
//         //next middleware
//         next();
//     }
//     else {
//         //Forbidden
//         res.sendStatus(403);
//     }
// }


//APi to fetch all the details of admin and user roles
router.get("/", async (req, res) => {
    
    try {
        const result = await knex.raw(`select * from users`)
            .catch((error) => {
                console.log(error)
                throw "Error occurred while processing your request"
            })
        res.send({ message: "Success", data: result[0] })
    } catch (error) {
        res.json({ error: error, message: 'Error occurred while processing your request' })
    }
})

//Paginated Api to fetch users
router.get("/:page/:size", async (req, res) => {

    try {
        let { page, size } = req.params;
        if (!page) {
            page = 1
        }
        if (!size) {
            size = 10
        }
        const limit = parseInt(size)
        const skip = (page - 1) * size
        const result = await knex.select('*')
            .from('users')
            .limit(limit)
            .offset(skip)

            .catch((error) => {
                console.log(error)
                throw "Error occurred while processing your request"
            })
        res.send({ message: "Success", data: result })
    } catch (error) {
        res.json({ error: error, message: 'Error occurred while processing your request' })
    }
})

//APi to get all users other than the admin
router.get("/employee", async (req, res) => {
    try {
        const result = await knex.raw(`select * from users where role_id = 2`)
            .catch((error) => {
                console.log(error)
                throw "Error occurred while processing your request"
            })
        res.send({ message: "Success", data: result[0] })
    } catch (error) {
        res.json({ error: error, message: 'Error occurred while processing your request' })
    }
})

//API to get single user by id
router.get("/:id", token.verifyToken, async (req, res) => {
    try {
        const result = await knex.raw(`select * from users where id=?`, [req.params.id])
            .catch((error) => {
                console.log(error)
                throw "Error occurred while processing your request"
            })
        res.send({ message: "Success", data: result[0] })
    } catch (error) {
        res.json({ error: error, message: 'Error occurred while processing your request' })
    }
})

//APi to add new user by admin
router.post("/", async (req, res) => {
    let data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        designation: req.body.designation,
        department: req.body.department,
        address: req.body.address,
        role_id: 2
    }
    try {
        const result = await knex.raw(`insert into users(name, email, password, designation, department,address, role_id)
        values(?,?,?,?,?,?,?)`, [data.name, data.email, data.password, data.designation, data.department, data.address, data.role_id])
            .catch((error) => {
                console.log(error)
                throw "Error occurred while processing your request"
            })
        res.send({ message: "Success" })
    } catch (error) {
        res.json({ error: error, message: 'Error occurred while processing your request' })
    }
})

//APi to update user information
router.put("/:id", token.verifyToken, async (req, res) => {
    let data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        designation: req.body.designation,
        department: req.body.department,
        role_id: req.body.role_id
    }
    try {
        const result = await knex.raw(`update users set name = "${data.name}", email = "${data.email}", password = "${data.password}", designation = "${data.designation}", department = "${data.department}", role_id = ${data.role_id}  where id = ${req.params.id}`)
            .catch((error) => {
                console.log(error)
                throw "Error occurred while processing your request"
            })
        res.send({ message: "Success" })
    } catch (error) {
        res.json({ error: error, message: 'Error occurred while processing your request' })
    }
})

//APi to delte user by admin
router.delete("/:id", async (req, res) => {
    try {
        const result = await knex.raw(`delete from users where id= ?`, [req.params.id])
            .catch((error) => {
                console.log(error)
                throw "Error occurred while processing your request"
            })
        if (result[0].affectedRows == 0) {
            res.send({ message: "User not present", data: result[0] })
        }
        else {

            res.send({ message: "Successfully deleted.", data: result[0].affectedRows })
        }
    } catch (error) {
        res.json({ error: error, message: 'Error occurred while processing your request' })
    }
})

//APi to login user
router.post("/login", async (req, res) => {
    const data = {
        email: req.body.email,
        password: req.body.password
    }
    try {
        const result = await knex.raw(`select * from users where email = ? and password = ?`, [data.email, data.password])
            .catch((error) => {
                console.log(error)
                throw "No user found"
            })
        if (result[0].length) {
            let userToken = token.generateToken(result[0][0].email)
            return res.json({ userId: result[0][0].id, userName: result[0][0].name, userToken: userToken, userRole: result[0][0].role_id })
            // return res.send({ message: "User found", data: result[0][0] })
        }

        // console.log("User Details", result[0]);
        return res.status(404).send({ message: "User Not found" })

    } catch (error) {
        res.json({ error: error, message: 'User does not exist' })
    }
})

//APi for forget password and sending email to the user
router.post("/forgot-password", async (req, res) => {
    const email = req.body.email
    var digits = '0123456789';
    let otp = '';
    for (let i = 0; i < 4; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    // const otp = `${Math.floor(1000 + Math.random() * 9000)}`
    // const otp = "0000"
    try {
        const result = await knex.raw(`insert into otp(email, code)
        values(?,?)`, [email, otp])
            .catch((error) => {
                console.log(error)
                throw "Error occurred while processing your request"
            })
        res.send({ message: "Success" })
    } catch (error) {
        res.json({ error: error, message: 'Error occurred while processing your request' })
    }
    // mail functionality
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: false,
        service: 'gmail',
        auth: {
            user: "rrout.ee.2018@nist.edu",
            pass: "Ritick#Rout@12"
        }
    });


    transporter.verify((err, success) => {
        if (err) console.error(err);
        console.log('Your mail config is correct');
    });


    // var mailOptions = {
    //     from: 'info@attendance.com',
    //     to: email,
    //     subject: 'Verify your Email',
    //     html: `<p>This is your otp: <b>${otp}</b></p> <p>This will expire in 15 Minutes</p>`
    // };
    var mailOptions = {
        from: "rrout.ee.2018@nist.edu",
        to: req.body.email,
        subject: "Otp to reset password: ",
        html: "<h3>OTP for account Password Reset is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>"
    };

    // transporter.sendMail(mailOptions, function (error, info) {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log('Email sent: ' + info.response);
    //     }
    // });
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) console.log(err)
        console.log('Message sent: %s', data.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(data));
    })
})

//APi to verify otp from the database
router.post("/verify-otp/:email", async (req, res) => {
    const otp = req.body.otp
    console.log("otp", req.body);
    try {
        const result = await knex.raw(`select * from otp where email = "${req.params.email}" and code = "${req.body.otp}"`)
            .catch((error) => {
                console.log(error)
                throw "Error occurred"
            })
        console.log("code", result[0][0].code);
        res.send({ message: "Otp Verified", data: result[0][0].code })
    } catch (error) {
        console.log(error);
        res.json({ error: error, message: 'Error occurred while processing your request' })
    }
})

//APi to delete otp from databse
router.delete("/delete-otp/:email", async (req, res) => {
    try {
        const result = await knex.raw(`delete from otp where email= ?`, [req.params.email])
            .catch((error) => {
                console.log(error)
                throw "Error occurred while processing your request"
            })
        if (result[0].affectedRows == 0) {
            res.send({ message: "User not present", data: result[0] })
        }
        else {

            res.send({ message: "Successfully deleted.", data: result[0].affectedRows })
        }
    } catch (error) {
        res.json({ error: error, message: 'Error occurred while processing your request' })
    }
})

//APi to reset password
router.post("/reset-password/:email", async (req, res) => {
    try {
        console.log("body", req.body.password);
        const result = await knex.raw(`update users set password="${req.body.password}" where email = "${req.params.email}"`)
            .catch((error) => {
                console.log(error)
                throw "Error occurred"
            })
        res.send({ message: "Password Changed succesfully" })
    } catch (error) {
        console.log(error);
        res.json({ error: error, message: 'Error occurred while changing password' })
    }
})


module.exports = router
