let express = require('express')
let router = express.Router()
let moment = require('moment');
const knex = require('../config/db_properties')

router.get("/", async (req, res) => {
    try {
        const result = await knex.raw(`select * from events`)
            .catch((error) => {
                console.log(error)
                throw "Error occurred while processing your request"
            })
            // console.log(result[0]);
            for(var i = 0 ; i<result[0].length; i++){
                // console.log(moment(result[0][i].start).format('L') );
                result[0][i].start = moment(result[0][i].start).format('L')
            }
        res.send({ message: "Success", data: result[0] })
    } catch (error) {
        res.json({ error: error, message: 'Error occurred while processing your request' })
    }
})

router.post("/", async (req, res) => {
    let data = {
        event_name: req.body.name,
        event_date: req.body.date
    }
    try {
        const result = await knex.raw(`insert into events(start, title)
values(?,?)`, [data.event_date, data.event_name])
            .catch((error) => {
                console.log(error)
                throw "Error occurred while processing your request"
            })
        res.send({ message: "Success" })
    } catch (error) {
        res.json({ error: error, message: 'Error occurred while processing your request' })
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const result = await knex.raw(`delete from events where id= ?`, [req.params.id])
            .catch((error) => {
                console.log(error)
                throw "Error occurred while processing your request"
            })
        if (result[0].affectedRows == 0) {
            res.send({ message: "Event not present", data: result[0] })
        }
        else {

            res.send({ message: "Successfully deleted.", data: result[0].affectedRows })
        }
    } catch (error) {
        res.json({ error: error, message: 'Error occurred while processing your request' })
    }
})

module.exports = router