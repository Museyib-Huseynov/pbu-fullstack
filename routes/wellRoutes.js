const express = require('express')
const router = express.Router()

const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication')
const {
  createWell,
  getAllWells,
  getSingleWell,
} = require('../controllers/wellController')

router
  .route('/')
  .post(authenticateUser, createWell)
  .get(authenticateUser, getAllWells)

router.route('/:wellID').get(authenticateUser, getSingleWell)

module.exports = router
