const CustomError = require('../errors')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  try {
    const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`
    const message = `<p>Please confirm your email by clicking on the following link : 
    <a href="${verifyEmail}">Verify Email</a> </p>`
    const msg = {
      to: email,
      from: 'pta.teamdev@gmail.com',
      subject: 'Email Verification',
      html: `<h4> Hello, ${name}</h4>
      ${message}
      `,
    }
    await sgMail.send(msg)
  } catch (error) {
    console.log(error)
    console.log(error.response.body.errors)
    throw new CustomError.UnauthorizedError(
      'Email could not be sent by SendGrid'
    )
  }
}

module.exports = sendVerificationEmail
