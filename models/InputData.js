const mongoose = require('mongoose')

const InputDataSchema = new mongoose.Schema({
  field: { type: String, required: true },
  well: { type: Number, required: true },
  porosity: { type: Number, required: true },
  viscosity: { type: Number, required: true },
  totalCompressibility: { type: Number, required: true },
  wellRadius: { type: Number, required: true },
  fvf: { type: Number, required: true },
  effectiveThickness: { type: Number, required: true },
  rate: { type: Number, required: true },
  productionTime: { type: Number, required: true },
  shapeFactor: { type: Number, required: true },
  area: { type: Number, required: true },
  importedData: { type: [Array], required: true },
  mdhRegression: {},
  mdhAnnotation: {},
  hornerRegression: {},
  hornerAnnotation: {},
  agarwalRegression: {},
  agarwalAnnotation: {},
  timeIARF: Number,
  pressureChangeIARF: Number,
  pressureDerivativeIARF: Number,
  timeWBS: Number,
  pressureWBS: Number,
  annotationIARF: {},
  annotationWBS: {},
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
})

InputDataSchema.index({ field: 1, well: 1 }, { unique: true })

module.exports = mongoose.model('InputData', InputDataSchema)
