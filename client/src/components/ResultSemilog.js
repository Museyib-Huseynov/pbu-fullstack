import React from 'react'
import styled from 'styled-components'
import { useInputContext } from '../context/input_context'

function ResultSemilog({ type, regressionLine }) {
  // when pushing database mongoose does not add regressionline predict function, so  we define manually
  if (regressionLine) {
    regressionLine.predict = (x) => {
      return [x, regressionLine.equation[0] * x + regressionLine.equation[1]]
    }
  }

  const {
    porosity,
    viscosity,
    totalCompressibility,
    wellRadius,
    fvf,
    effectiveThickness,
    rate,
    productionTime,
    shapeFactor,
    area,
    importedData,
  } = useInputContext()
  const allInputsFilled =
    porosity !== '' &&
    viscosity !== '' &&
    totalCompressibility !== '' &&
    wellRadius !== '' &&
    fvf !== '' &&
    effectiveThickness !== '' &&
    rate !== '' &&
    productionTime !== '' &&
    shapeFactor !== '' &&
    area !== ''

  const inputEmptyWarning = (
    <p className='warning'>Please fill all input data</p>
  )
  const regressionWarning = (
    <p className='warning'>Please draw the regression line</p>
  )

  const calcPerm = () => {
    if (!regressionLine) return null
    if (!allInputsFilled) return null
    const slope = Math.abs(regressionLine.equation[0])
    return (
      (162.6 * rate * fvf * viscosity) /
      (slope * effectiveThickness)
    ).toFixed(1)
  }

  const permeability = calcPerm()

  const calcSkin = () => {
    if (!regressionLine) return null
    if (!allInputsFilled) return null
    const slope = Math.abs(regressionLine.equation[0])
    let pressureAtOneHour = 0
    if (type === 'MDH method') {
      pressureAtOneHour = regressionLine.predict(0)[1]
    }
    if (type === 'Horner method') {
      pressureAtOneHour = regressionLine.predict(
        Math.log10((productionTime + 1) / 1)
      )[1]
    }
    if (type === 'Agarwal Equivalent-Time method') {
      pressureAtOneHour = regressionLine.predict(
        Math.log10((productionTime * 1) / (productionTime + 1))
      )[1]
    }
    const flowingWellborePressure = importedData[0][1]
    return (
      1.151 *
      ((pressureAtOneHour - flowingWellborePressure) / slope -
        Math.log10(
          permeability /
            (porosity *
              0.01 *
              viscosity *
              totalCompressibility *
              Math.pow(wellRadius, 2))
        ) +
        3.23)
    ).toFixed(2)
  }

  const skin = calcSkin()
  ///////////////////////////////////////////////////////////////////////////
  // calculate false pressure when HTR=1 or log(HTR)=0
  let falsePressure = ''
  if (regressionLine) {
    falsePressure = regressionLine.predict(0)[1]
  }
  ////////////////////////////////////////////////////////////////////////////
  // calculate average pressure in Horner method using Ramey-Cobb Method
  const HTRForAveragePressure =
    (0.0002637 * permeability * shapeFactor * productionTime) /
    (porosity * 0.01 * viscosity * totalCompressibility * area * 43560)
  let averagePressure = ''
  if (regressionLine) {
    averagePressure = regressionLine.predict(
      Math.log10(HTRForAveragePressure)
    )[1]
  }
  ////////////////////////////////////////////////////////////////////////////
  return (
    <ResultWrapper>
      {!allInputsFilled ? inputEmptyWarning : null}
      {!regressionLine ? regressionWarning : null}
      <table>
        <tbody>
          <tr>
            <th colSpan='2'>{`Results (${type})`}</th>
          </tr>
          <tr>
            <td>Permeability (mD)</td>
            <td>{permeability}</td>
          </tr>
          <tr>
            <td>Skin factor</td>
            <td>{skin}</td>
          </tr>
          {type === 'Horner method' && (
            <>
              <tr>
                <td>p* - false pressure</td>
                <td>{falsePressure}</td>
              </tr>
              <tr>
                <td>Average Pressure (psi)</td>
                <td>{averagePressure}</td>
              </tr>
            </>
          )}
        </tbody>
      </table>
      {type === 'Horner method' && (
        <>
          <p className='note1'>
            <span>Note 1: </span>The reservoir must be infinite acting from the
            beginning of production through the end of the buildup for the
            extrapolated pressure p* to be the same as the initial reservoir
            pressure. If the reservoir is not infinite acting, the extrapolated
            pressure p* is neither the initial reservoir pressure nor the
            average drainage-area pressure
          </p>
          <p className='note2'>
            <span>Note 2: </span>Average drainage-area pressure is calculated
            with Ramey-Cobb method using Horner semilog plot
          </p>
        </>
      )}
    </ResultWrapper>
  )
}

const ResultWrapper = styled.div`
  display: grid;
  place-items: center;
  table,
  th,
  td {
    border: 1px solid #000;
    text-align: center;
    padding: 10px;
  }
  table {
    border-collapse: collapse;
    width: 300px;
  }
  th {
    background: #c8c8c8;
    color: #000;
  }
  td:first-of-type {
    width: 200px;
  }
  .warning {
    color: red;
    margin-bottom: 0.5rem;
  }

  .note1,
  .note2 {
    margin: 1rem;
    text-align: justify;
  }
  span {
    color: red;
    font-weight: 900;
  }
`

export default ResultSemilog
