const express = require('express')
const app = express()
let bodyparser = require('body-parser')
let cors = require('cors')

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: false }))
app.use(cors())

let users = require('./API/userAPI')
app.use('/users', users)

/**
 * http://localhost:5000/users
 * get, post
 * http://localhost:5000/users/id
 * get,post,delete
 */

let sheet = require('./API/timesheetAPI')
app.use('/sheet', sheet)

let events = require('./API/eventsAPI')
app.use('/events', events)

app.listen(5000, console.log('Server is running on port 5000'))