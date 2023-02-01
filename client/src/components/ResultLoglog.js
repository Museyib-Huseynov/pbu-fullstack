import React from 'react'
import styled from 'styled-components'
import { useInputContext } from '../context/input_context'

function ResultLoglog({
  type,
  timeIARF,
  pressureChangeIARF,
  pressureDerivativeIARF,
  timeWBS,
  pressureWBS,
}) {
  const {
    porosity,
    viscosity,
    totalCompressibility,
    wellRadius,
    fvf,
    effectiveThickness,
    rate,
  } = useInputContext()

  const allInputsFilled =
    porosity !== '' &&
    viscosity !== '' &&
    totalCompressibility !== '' &&
    wellRadius !== '' &&
    fvf !== '' &&
    effectiveThickness !== '' &&
    rate !== ''

  const inputEmptyWarning = (
    <p className='warning'>Please fill all input data</p>
  )
  const IARFWarning = <p className='warning'>Please draw IARF line</p>
  const WBSWarning = <p className='warning'>Please draw WBS line</p>

  const calcPerm = () => {
    if (!allInputsFilled) return null
    if (!pressureDerivativeIARF) return null
    return (
      (70.6 * rate * fvf * viscosity) /
      (effectiveThickness * Math.pow(10, pressureDerivativeIARF))
    ).toFixed(1)
  }

  const permeability = calcPerm()

  const calcSkin = () => {
    if (!allInputsFilled) return null
    if (!pressureDerivativeIARF) return null
    return (
      0.5 *
      (Math.pow(10, pressureChangeIARF) / Math.pow(10, pressureDerivativeIARF) -
        Math.log(
          (permeability * Math.pow(10, timeIARF)) /
            (1688 *
              porosity *
              0.01 *
              viscosity *
              totalCompressibility *
              Math.pow(wellRadius, 2))
        ))
    ).toFixed(2)
  }

  const skin = calcSkin()

  const calcWBS = () => {
    if (!allInputsFilled) return null
    if (!pressureWBS) return null
    return (
      (rate * fvf * Math.pow(10, timeWBS)) /
      (24 * Math.pow(10, pressureWBS))
    ).toFixed(5)
  }

  const WBS = calcWBS()

  return (
    <ResultWrapper>
      {!allInputsFilled ? inputEmptyWarning : null}
      {!timeIARF ? IARFWarning : null}
      {!timeWBS ? WBSWarning : null}
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
          <tr>
            <td>Wellbore Storage (bbl/psi)</td>
            <td>{WBS}</td>
          </tr>
        </tbody>
      </table>
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
`

export default ResultLoglog
