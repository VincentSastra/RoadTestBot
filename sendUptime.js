const nodemailer = require('nodemailer')

exports.sendUptime = () => {
	const mail = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.gmailname,
			pass: process.env.gmailpass,
		}
	});
	
	mail.sendMail({
		from: process.env.gmailname,
		to: process.env.gmailgoal,
		subject: 'I\'m still alive',
		text: 'Beep boop robot check in',
	})
}