import React, { useContext, useReducer } from 'react'
import reducer from '../reducers/input_reducer'
import {
  SET_INPUT,
  SET_IMPORT,
  LOAD_SAMPLE_DATA,
  LOAD_WELL_DATA,
  SET_MDH_REGRESSION,
  SET_MDH_ANNOTATION,
  SET_HORNER_REGRESSION,
  SET_HORNER_ANNOTATION,
  SET_AGARWAL_REGRESSION,
  SET_AGARWAL_ANNOTATION,
  SET_TIME_IARF,
  SET_PRESSURE_CHANGE_IARF,
  SET_PRESSURE_DERIVATIVE_IARF,
  SET_TIME_WBS,
  SET_PRESSURE_WBS,
  SET_ANNOTATION_IARF,
  SET_ANNOTATION_WBS,
} from '../actions'
import readXlsxFile from 'read-excel-file'

const initialState = {
  field: '',
  well: '',
  porosity: '',
  viscosity: '',
  totalCompressibility: '',
  wellRadius: '',
  fvf: '',
  effectiveThickness: '',
  rate: '',
  productionTime: '',
  shapeFactor: '',
  area: '',
  importedData: [],
  mdhRegression: '',
  mdhAnnotation: '',
  hornerRegression: '',
  hornerAnnotation: '',
  agarwalRegression: '',
  agarwalAnnotation: '',
  timeIARF: '',
  pressureChangeIARF: '',
  pressureDerivativeIARF: '',
  timeWBS: '',
  pressureWBS: '',
  annotationIARF: '',
  annotationWBS: '',
}

const InputContext = React.createContext()

const InputProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const setInput = (e) => {
    const name = e.target.name
    let value = e.target.value
    if (name === 'field') {
      value = value.toUpperCase().slice(0, 3)
    }
    if (name === 'porosity' && (value < 0 || value > 100)) {
      value = 0
    }
    dispatch({ type: SET_INPUT, payload: { name, value } })
  }

  const setImport = (e) => {
    readXlsxFile(e.target.files[0]).then((rows) => {
      dispatch({ type: SET_IMPORT, payload: rows })
    })
  }

  const loadSampleData = () => {
    dispatch({ type: LOAD_SAMPLE_DATA })
  }

  const loadWellData = (data) => {
    dispatch({ type: LOAD_WELL_DATA, payload: data })
  }

  const setMDHRegression = (regression) => {
    dispatch({ type: SET_MDH_REGRESSION, payload: regression })
  }

  const setMDHAnnotation = (annotationObject) => {
    dispatch({ type: SET_MDH_ANNOTATION, payload: annotationObject })
  }

  const setHornerRegression = (regression) => {
    dispatch({ type: SET_HORNER_REGRESSION, payload: regression })
  }

  const setHornerAnnotation = (annotationObject) => {
    dispatch({ type: SET_HORNER_ANNOTATION, payload: annotationObject })
  }

  const setAgarwalRegression = (regression) => {
    dispatch({ type: SET_AGARWAL_REGRESSION, payload: regression })
  }

  const setAgarwalAnnotation = (annotationObject) => {
    dispatch({ type: SET_AGARWAL_ANNOTATION, payload: annotationObject })
  }

  const setTimeIARF = (time) => {
    dispatch({ type: SET_TIME_IARF, payload: time })
  }

  const setPressureChangeIARF = (pressure) => {
    dispatch({ type: SET_PRESSURE_CHANGE_IARF, payload: pressure })
  }

  const setPressureDerivativeIARF = (pressure) => {
    dispatch({ type: SET_PRESSURE_DERIVATIVE_IARF, payload: pressure })
  }

  const setTimeWBS = (time) => {
    dispatch({ type: SET_TIME_WBS, payload: time })
  }

  const setPressureWBS = (pressure) => {
    dispatch({ type: SET_PRESSURE_WBS, payload: pressure })
  }

  const setAnnotationIARF = (annotation) => {
    dispatch({ type: SET_ANNOTATION_IARF, payload: annotation })
  }

  const setAnnotationWBS = (annotation) => {
    dispatch({ type: SET_ANNOTATION_WBS, payload: annotation })
  }

  return (
    <InputContext.Provider
      value={{
        ...state,
        setInput,
        setImport,
        loadSampleData,
        loadWellData,
        setMDHRegression,
        setMDHAnnotation,
        setHornerRegression,
        setHornerAnnotation,
        setAgarwalRegression,
        setAgarwalAnnotation,
        setTimeIARF,
        setPressureChangeIARF,
        setPressureDerivativeIARF,
        setTimeWBS,
        setPressureWBS,
        setAnnotationIARF,
        setAnnotationWBS,
      }}
    >
      {children}
    </InputContext.Provider>
  )
}

const useInputContext = () => {
  return useContext(InputContext)
}

export { InputProvider, useInputContext, initialState }
