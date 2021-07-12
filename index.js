const fetch = require('node-fetch')
const nodemailer = require('nodemailer')
const { checkAppointment } = require('./checkAppointment');
const { sendUptime } = require('./sendUptime');

require('dotenv').config()

checkAppointment();
setInterval(checkAppointment, 1000 * 60 * 5);
sendUptime();
setInterval(sendUptime, 1000 * 60 * 60 * 24);