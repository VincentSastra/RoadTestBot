const fetch = require('node-fetch')
const nodemailer = require('nodemailer')
const { checkAppointment } = require('./checkAppointment');
const { sendUptime } = require('./sendUptime');

require('dotenv').config()

checkAppointment();
setInterval(checkAppointment, 1000 * 60 * 5);
sendUptime();
setInterval(sendUptime, 1000 * 60 * 60 * 24);

const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Status OK! Checking for appointments before ' + new Date(process.env.searchdate).toDateString())
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Listening to http://localhost:${port}`)
})