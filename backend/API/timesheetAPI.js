let express = require('express')
let router = express.Router()
const knex = require('../config/db_properties')
const token = require('../auth/token')

//API to get current data status of users
router.get("/", async (req, res) => {
    try {
        // const result = await knex.raw(`select t.user_id as id,t.status as status,u.name,t.time_in,t.time_out from timesheets as t inner join users as u on t.user_id=u.id where t.user_id in (select id from users where role_id=2) and date(t.created_at)=curdate() union select id as id,'Absent' as status,name,'' as time_in,'' as time_out from users where id not in (select user_id from timesheets where date(created_at)=curdate()) and role_id=2`)
        const result = await knex.raw(`select a.name,b.time_in,b.time_out,b.status from users a left join timesheets b on a.id = b.user_id and date_format(b.time_in, "%Y-%m-%d") = curdate() where a.role_id = 2;`)
            .catch((error) => {
                console.log(error)
                throw "Error occurred while processing your request"
            })
        res.send({ message: "Success", data: result[0] })
    } catch (error) {
        res.json({ error: error, message: 'Error occurred while processing your request' })
    }
})

//API to get details of particler user if he has already timed or not 
router.get("/user/:id", async (req, res) => {
    try {
        const result = await knex.raw(`select * from  timesheets where date(created_at) = curdate() and user_id = ${req.params.id}`)
            .catch((error) => {
                console.log(error)
                throw "Error occurred while processing your request"
            })
        res.send({ message: "Success", data: result[0] })
    } catch (error) {
        res.json({ error: error, message: 'Error occurred while processing your request' })
    }
})

//Api for timing in
router.post("/timein/:id", async (req, res) => {
    try {
        const result = await knex.raw(`insert into timesheets(user_id, time_in,status) values(${req.params.id},now(),"Working")`)
            .catch((error) => {
                console.log(error)
                throw "Error occurred while processing your request"
            })
        res.send({ message: "Success", data: result[0] })
    } catch (error) {
        res.json({ error: error, message: 'Error occurred while processing your request' })
    }
})

//Api for timing out
router.post("/timeout/:id", async (req, res) => {
    try {
        const result = await knex.raw(`UPDATE timesheets SET time_out = now(), status = "Present" WHERE user_id = ${req.params.id} and Date(created_at) = curDate() `)
            .catch((error) => {
                console.log(error)
                throw "Error occurred while processing your request"
            })
        res.send({ message: "Success", data: result[0] })
    } catch (error) {
        res.json({ error: error, message: 'Error occurred while processing your request' })
    }
})

//API to fetch user attedndance report
router.get("/:id", async (req, res) => {
    try {
        const result = await knex.raw(`select created_at as "date", time_in, time_out, status from timesheets where user_id = ${req.params.id}`)
            .catch((error) => {
                console.log(error)
                throw "Error occurred while processing your request"
            })
        res.send({ message: "Success", data: result[0] })
    } catch (error) {
        res.json({ error: error, message: 'Error occurred while processing your request' })
    }
})
      
//API to get users present on current date
router.get("/userstatus/present", async (req, res) => {
    try {
        const result = await knex.raw(`select u.name, t.time_in, t.time_out, t.status from users as u LEFT JOIN timesheets as t on u.id = t.user_id where date(t.created_at)=curdate()`)
            .catch((error) => {
                console.log(error)
                throw "Error occurred while processing your request"
            })
            console.log("Result", result[0]);
        res.send({ message: "Success", data: result[0] })
    } catch (error) {
        res.json({ error: error, message: 'Error occurred while processing your request' })
    }
})

//API to get users from search box input
router.get("/search/:name", async (req, res) => {
    try {
        if (req.params.name) {
            const result = await knex.raw(`select u.name, t.time_in, t.time_out, t.status from users as u LEFT JOIN timesheets as t on u.id = t.user_id where u.name LIKE "%${req.params.name}%"`)
                .catch((error) => {
                    console.log(error)
                    throw "Error occurred while processing your request"
                })
            res.send({ message: "Success", data: result[0] })
        }
        else{
            const result = await knex.raw(`select u.name, t.time_in, t.time_out, t.status from users as u LEFT JOIN timesheets as t on u.id = t.user_id where date(t.created_at)=curdate()`)
                .catch((error) => {
                    console.log(error)
                    throw "Error occurred while processing your request"
                })
            res.send({ message: "Success", data: result[0] })
        }

    } catch (error) {
        res.json({ error: error, message: 'Error occurred while processing your request' })
    }
})

//API to get report from date range for admin
router.get("/dateRange/:date1/:date2", async (req, res) => {
    try {
        const result = await knex.raw(`select u.name, t.time_in, t.time_out, t.status from users as u LEFT JOIN timesheets as t on u.id = t.user_id WHERE date_format(t.created_at, "%Y-%m-%d") BETWEEN '${req.params.date1}' AND '${req.params.date2}';`)
            .catch((error) => {
                console.log(error)
                throw "Error occurred while processing your request"
            })
        res.send({ message: "Success", data: result[0] })
    } catch (error) {
        res.json({ error: error, message: 'Error occurred while processing your request' })
    }
})

//API to get report from data range for user
router.get("/userDateRange/:id/:date1/:date2", async (req, res) => {
    try {
        const result = await knex.raw(`select created_at as "date", time_in, time_out, status from timesheets where (date_format(created_at, "%Y-%m-%d") BETWEEN '${req.params.date1}' AND '${req.params.date2}') and user_id = ${req.params.id}`)
            .catch((error) => {
                console.log(error)
                throw "Error occurred while processing your request"
            })
        res.send({ message: "Success", data: result[0] })
    } catch (error) {
        res.json({ error: error, message: 'Error occurred while processing your request' })
    }
})

module.exports = router