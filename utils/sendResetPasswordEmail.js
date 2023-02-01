const CustomError = require('../errors')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendresetPasswordEmail = async ({ name, email, token, origin }) => {
  try {
    const resetURL = `${origin}/user/reset-password?token=${token}&email=${email}`
    const message = `<p>Please reset password by clicking on the following link : 
    <a href="${resetURL}">Reset Password</a> </p>`
    const msg = {
      to: email,
      from: 'pta.teamdev@gmail.com',
      subject: 'Reset password',
      html: `<h4> Hello, ${name}</h4>
      ${message}
      `,
    }
    await sgMail.send(msg)
  } catch (error) {
    throw new CustomError.UnauthorizedError(
      'Email could not be sent by SendGrid'
    )
  }
}

module.exports = sendresetPasswordEmail
