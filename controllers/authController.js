const User = require('../models/User')
const Token = require('../models/Token')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const sendVerificationEmail = require('../utils/sendVerificationEmail')
const sendresetPasswordEmail = require('../utils/sendResetPasswordEmail')
const createTokenUser = require('../utils/createTokenUser')
const createHash = require('../utils/createHash')
const crypto = require('crypto')
const { attachCookiesToResponse } = require('../utils/jwt')

const register = async (req, res) => {
  const { name, email, password } = req.body
  // check the email whether it is unique
  const emailAlreadyExists = await User.findOne({ email })
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists')
  }
  //first registered user is admin
  const isFirstAccount = (await User.countDocuments({})) === 0
  const role = isFirstAccount ? 'admin' : 'user'
  // set verification token
  const verificationToken = crypto.randomBytes(40).toString('hex')

  // send verification email
  const origin = process.env.HOST
  await sendVerificationEmail({
    name,
    email,
    verificationToken,
    origin,
  })

  await User.create({
    name,
    email,
    password,
    role,
    verificationToken,
  })

  res.status(StatusCodes.CREATED).json({
    msg: 'Success! Please check your email to verify account',
  })
}

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body
  const user = await User.findOne({ email })

  if (!user) {
    throw new CustomError.UnauthenticatedError('Verification Failed')
  }

  if (user.verificationToken !== verificationToken) {
    throw new CustomError.UnauthenticatedError('Verification Failed')
  }

  user.isVerified = true
  user.verified = Date.now()
  user.verificationToken = ''

  await user.save()

  res.status(StatusCodes.OK).json({ msg: 'Email Verified' })
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password')
  }

  const user = await User.findOne({ email })

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials')
  }
  // check if the password correct
  const isPasswordCorrect = await user.comparePassword(password)

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials')
  }
  if (!user.isVerified) {
    throw new CustomError.UnauthenticatedError('Please verify your email')
  }

  const tokenUser = createTokenUser(user)
  // create refresh token
  let refreshToken = ''
  // check for existing token
  const existingToken = await Token.findOne({ user: user._id })
  if (existingToken) {
    const { isValid } = existingToken
    if (!isValid) {
      throw new CustomError.UnauthenticatedError('User banned by admin')
    }
    refreshToken = existingToken.refreshToken
    attachCookiesToResponse({ res, user: tokenUser, refreshToken })
    res.status(StatusCodes.OK).json({ user: tokenUser })
    return
  }

  refreshToken = crypto.randomBytes(40).toString('hex')
  const ip = req.ip
  const userAgent = req.headers['user-agent']

  const userToken = { refreshToken, ip, userAgent, user: user._id }
  await Token.create(userToken)

  attachCookiesToResponse({ res, user: tokenUser, refreshToken })
  res.status(StatusCodes.OK).json({ user: tokenUser })
}

const logout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.userId })

  res.clearCookie('accessToken')
  res.clearCookie('refreshToken')

  res.status(StatusCodes.OK).json({ msg: 'User logged out' })
}

const forgotPassword = async (req, res) => {
  const { email } = req.body
  if (!email) {
    throw new CustomError.BadRequestError('Please provide valid email')
  }

  const user = await User.findOne({ email })

  if (user) {
    const passwordToken = crypto.randomBytes(70).toString('hex')
    // send email
    const origin = 'http://localhost:3000'
    await sendresetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin,
    })

    const tenMinutes = 10 * 60 * 1000
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes)

    user.passwordToken = createHash(passwordToken)
    user.passwordTokenExpirationDate = passwordTokenExpirationDate
    await user.save()

    res
      .status(StatusCodes.OK)
      .json({ msg: 'Please check your email for reset password link' })
  }
}

const resetPassword = async (req, res) => {
  const { token, email, password } = req.body
  if (!token || !email || !password) {
    throw new CustomError.BadRequestError('Please provide all values')
  }

  const user = await User.findOne({ email })

  if (user) {
    const currentDate = new Date()

    if (
      user.passwordToken === createHash(token) &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      user.password = password
      user.passwordToken = null
      user.passwordTokenExpirationDate = null
      await user.save()
    }
  }
  res.send('reset password')
}

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
}
