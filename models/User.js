const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide name'],
      maxlength: 20,
      minlength: 3,
    },
    email: {
      type: String,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: 'Please provide valid email',
      },
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minLength: 6,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    verificationToken: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    verified: Date,
    passwordToken: {
      type: String,
    },
    passwordTokenExpirationDate: {
      type: Date,
    },
  },
  { timestamps: true }
)

UserSchema.pre('save', async function () {
  // console.log(this.modifiedPaths())
  // console.log(this.isModified('name'))
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}

module.exports = mongoose.model('User', UserSchema)
