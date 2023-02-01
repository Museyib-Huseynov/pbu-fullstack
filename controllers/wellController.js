const InputData = require('../models/InputData')
const { StatusCodes } = require('http-status-codes')

const createWell = async (req, res) => {
  req.body.user = req.user.userId
  const existingWell = await InputData.find({
    well: req.body.well,
    field: req.body.field,
  })
  if (existingWell.length !== 0) {
    const well = await InputData.findOneAndUpdate(
      {
        well: req.body.well,
        field: req.body.field,
      },
      req.body,
      { new: true, runValidators: true }
    )
    res.status(StatusCodes.OK).json({ well })
  } else {
    const well = await InputData.create(req.body)
    res.status(StatusCodes.CREATED).json({ well })
  }
}

const getAllWells = async (req, res) => {
  let wells = null
  if (req.user.role === 'admin') {
    wells = await InputData.find({}).sort('field well')
  } else {
    wells = await InputData.find({ user: req.user.userId })
  }
  res.status(StatusCodes.OK).json({ wells })
}

const getSingleWell = async (req, res) => {
  const { wellID } = req.params
  const well = await InputData.find({
    _id: wellID,
    user: req.user.userId,
  }).select('-_id -__v -user')
  res.status(StatusCodes.OK).json({ well })
}

module.exports = {
  createWell,
  getAllWells,
  getSingleWell,
}
