const fetch = require('node-fetch')
const nodemailer = require('nodemailer')

require('dotenv').config()

exports.handler =  async (event, context) => {
	const mail = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.gmailname,
			pass: process.env.gmailpass,
		}
	});
	
	const searchDate = new Date(process.env.searchdate)

	try {
		let body = JSON.stringify({
			drvrLastName: process.env.lastname,
			keyword: process.env.keyword,
			licenceNumber: process.env.license,
		})

		const authReq = await fetch('https://onlinebusiness.icbc.com/deas-api/v1/webLogin/webLogin', {
			method: 'put',
			body: body,
			headers: {
				'Content-Type': 'application/json',
			},
		})
		console.log(authReq)

		const authToken = authReq.headers.raw().authorization[0]

		const appointmentRequest = await fetch('https://onlinebusiness.icbc.com/deas-api/v1/web/getAvailableAppointments', {
			method: 'post',
			body: JSON.stringify({
				aPosID: 8,
				examDate: "2021-07-12",
				examType: "5-R-1",
				ignoreReserveTime: false,
				lastName: process.env.lastname,
				licenseNumber: process.env.license,
				prfDaysOfWeek: "[0,1,2,3,4,5,6]",
				prfPartsOfDay: "[0,1]",
			}),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': authToken,
			}
		})

		const appointmentJson = await appointmentRequest.json()

		const availableBefore = appointmentJson.find(row => {
			const appointmentDate = new Date(row.appointmentDt.date)
			return appointmentDate.getTime() < searchDate.getTime()
		})?.appointmentDt?.date
		
		console.log("All date: \n" +
			appointmentJson.reduce((acc, cur) => {
				const appointmentDate = new Date(cur.appointmentDt.date)
				return acc + "\n" + appointmentDate 
			}, ""))

		if (availableBefore !== undefined) {
			mail.sendMail({
				from: process.env.gmailname,
				to: process.env.gmailgoal,
				subject: 'Booking found on ' + new Date(availableBefore).toDateString(),
				text: 'Gogogo!',
			})
			console.log("Found" + availableBefore)
		} else {
			console.log("Earliest is " + (new Date(appointmentJson[0]?.appointmentDt?.date)))
		}
	} catch (e) {
		console.log(e)
		mail.sendMail({
			from: process.env.gmailname,
			to: process.env.gmailgoal,
			subject: 'Error',
			text: JSON.stringify(e),
		})
	}
}