import { useRef, useState, useEffect } from 'react'
import { ResultLoglog } from '../components'
import { useInputContext } from '../context/input_context'
import styled from 'styled-components'
import { Chart, registerables } from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import { getRelativePosition } from 'chart.js/helpers'

Chart.register(...registerables, annotationPlugin)

function LogLog() {
  const [IARF, setIARF] = useState(false)
  const [WBS, setWBS] = useState(false)

  const chartRef = useRef(null)
  const {
    importedData,
    timeIARF,
    setTimeIARF,
    pressureChangeIARF,
    setPressureChangeIARF,
    pressureDerivativeIARF,
    setPressureDerivativeIARF,
    timeWBS,
    setTimeWBS,
    pressureWBS,
    setPressureWBS,
    annotationIARF,
    setAnnotationIARF,
    annotationWBS,
    setAnnotationWBS,
  } = useInputContext()
  ///////////////////////////////////////////////////////
  // handle IARF
  ////////////////////////////////////////////////////////
  const handleIARF = () => {
    setIARF(!IARF)
    if (WBS) {
      setWBS(false)
    }
    let chart = Chart.getChart('canvasID')
    if (IARF) {
      chart.options.onClick = null
    } else {
      chart.options.onClick = function (e) {
        const canvasPosition = getRelativePosition(e, chart)
        const dataX = chart.scales.x.getValueForPixel(canvasPosition.x)
        const dataY = chart.scales.y.getValueForPixel(canvasPosition.y)

        const timeForIARF = derivativePressureData.filter(
          (item) => item[0] >= dataX
        )[0][0]
        const pressureChangeForIARF = pressureChangeData.find(
          (item) => item[0] === timeForIARF
        )[1]
        const pressureDerivativeForIARF = derivativePressureData.find(
          (item) => item[0] === timeForIARF
        )[1]

        setTimeIARF(timeForIARF)
        setPressureChangeIARF(pressureChangeForIARF)
        setPressureDerivativeIARF(pressureDerivativeForIARF)

        setAnnotationIARF({
          xMin: dataX - 0.8,
          xMax: dataX + 0.8,
          yMin: dataY,
          yMax: dataY,
        })

        if (annotationWBS.length === 0) {
          chart.options.plugins.annotation.annotations = {
            IARF: {
              type: 'line',
              xMin: dataX - 0.8,
              xMax: dataX + 0.8,
              yMin: dataY,
              yMax: dataY,
              borderColor: 'black',
              borderWidth: 2,
              label: {
                enabled: true,
                content: 'IARF',
                backgroundColor: 'transparent',
                color: 'black',
                padding: 10,
                // xAdjust: -150,
                yAdjust: -20,
                font: { style: 'bold', size: 18 },
              },
            },
          }
        } else {
          chart.options.plugins.annotation.annotations = {
            IARF: {
              type: 'line',
              xMin: dataX - 0.8,
              xMax: dataX + 0.8,
              yMin: dataY,
              yMax: dataY,
              borderColor: 'black',
              borderWidth: 2,
              label: {
                enabled: true,
                content: 'IARF',
                backgroundColor: 'transparent',
                color: 'black',
                padding: 10,
                // xAdjust: -150,
                yAdjust: -20,
                font: { style: 'bold', size: 18 },
              },
            },
            WBS: {
              type: 'line',
              xMin: annotationWBS.xMin,
              xMax: annotationWBS.xMax,
              yMin: annotationWBS.yMin,
              yMax: annotationWBS.yMax,
              borderColor: 'black',
              borderWidth: 2,
              label: {
                enabled: true,
                content: 'WBS',
                backgroundColor: 'transparent',
                color: 'black',
                padding: 10,
                xAdjust: -20,
                yAdjust: -20,
                font: { style: 'bold', size: 18 },
              },
            },
          }
        }
        chart.update()
      }
    }
    chart.update()
  }
  ////////////////////////////////////////////////////////
  // handle WBS
  ///////////////////////////////////////////////////////
  const handleWBS = () => {
    setWBS(!WBS)
    if (IARF) {
      setIARF(false)
    }
    let chart = Chart.getChart('canvasID')
    if (WBS) {
      chart.options.onClick = null
    } else {
      chart.options.onClick = function (e) {
        const canvasPosition = getRelativePosition(e, chart)
        const dataX = chart.scales.x.getValueForPixel(canvasPosition.x)
        const dataY = chart.scales.y.getValueForPixel(canvasPosition.y)
        const b = dataY - dataX

        setTimeWBS(dataX)
        setPressureWBS(dataY)

        setAnnotationWBS({
          xMin: dataX - 0.6,
          xMax: dataX + 0.6,
          yMin: dataX - 0.6 + b,
          yMax: dataX + 0.6 + b,
        })

        if (annotationIARF.length === 0) {
          chart.options.plugins.annotation.annotations = {
            WBS: {
              type: 'line',
              xMin: dataX - 0.6,
              xMax: dataX + 0.6,
              yMin: dataX - 0.6 + b,
              yMax: dataX + 0.6 + b,
              borderColor: 'black',
              borderWidth: 2,
              label: {
                enabled: true,
                content: 'WBS',
                backgroundColor: 'transparent',
                color: 'black',
                padding: 10,
                xAdjust: -20,
                yAdjust: -20,
                font: { style: 'bold', size: 18 },
              },
            },
          }
        } else {
          chart.options.plugins.annotation.annotations = {
            IARF: {
              type: 'line',
              xMin: annotationIARF.xMin,
              xMax: annotationIARF.xMax,
              yMin: annotationIARF.yMin,
              yMax: annotationIARF.yMax,
              borderColor: 'black',
              borderWidth: 2,
              label: {
                enabled: true,
                content: 'IARF',
                backgroundColor: 'transparent',
                color: 'black',
                padding: 10,
                // xAdjust: -150,
                yAdjust: -20,
                font: { style: 'bold', size: 18 },
              },
            },
            WBS: {
              type: 'line',
              xMin: dataX - 0.6,
              xMax: dataX + 0.6,
              yMin: dataX - 0.6 + b,
              yMax: dataX + 0.6 + b,
              borderColor: 'black',
              borderWidth: 2,
              label: {
                enabled: true,
                content: 'WBS',
                backgroundColor: 'transparent',
                color: 'black',
                padding: 10,
                xAdjust: -20,
                yAdjust: -20,
                font: { style: 'bold', size: 18 },
              },
            },
          }
        }
        chart.update()
      }
    }
    chart.update()
  }
  ///////////////////////////////////////////////////
  //find pressureChange and derivative
  //////////////////////////////////////////////////
  const time = importedData.map((item) => item[0])
  const pressure = importedData.map((item) => item[1])
  const pressureChange = pressure.map((item) => item - pressure[0])
  const derivativePressure = time.map((item, index) => {
    return (
      item *
      ((pressureChange[index + 1] - pressureChange[index]) /
        (time[index + 1] - time[index]))
    )
  })

  const pressureChangeData = time
    .map((item, index) => {
      return [Math.log10(item), Math.log10(pressureChange[index])]
    })
    .slice(1, -1)

  const derivativePressureData = time
    .map((item, index) => {
      return [Math.log10(item), Math.log10(derivativePressure[index])]
    })
    .slice(1, -1)
  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const myChart = new Chart(chartRef.current, {
      type: 'scatter',
      ////////////////////////////////////////////
      data: {
        datasets: [
          {
            data: pressureChangeData,
            backgroundColor: 'green',
          },
          {
            data: derivativePressureData,
            backgroundColor: '#ff7000',
          },
        ],
      },
      ////////////////////////////////////////////
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Log (Δt)',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Log (Pressure)',
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Log Log Diagnostic plot',
            position: 'top',
            font: {
              size: 16,
              weight: 'bold',
            },
            color: '#000',
          },
          tooltip: {
            // enabled: false,
          },
          annotation: {
            annotations: {
              IARF: annotationIARF
                ? {
                    type: 'line',
                    xMin: annotationIARF.xMin,
                    xMax: annotationIARF.xMax,
                    yMin: annotationIARF.yMin,
                    yMax: annotationIARF.yMax,
                    borderColor: 'black',
                    borderWidth: 2,
                    label: {
                      enabled: true,
                      content: 'IARF',
                      backgroundColor: 'transparent',
                      color: 'black',
                      padding: 10,
                      // xAdjust: -150,
                      yAdjust: -20,
                      font: { style: 'bold', size: 18 },
                    },
                  }
                : null,
              WBS: annotationWBS
                ? {
                    type: 'line',
                    xMin: annotationWBS.xMin,
                    xMax: annotationWBS.xMax,
                    yMin: annotationWBS.yMin,
                    yMax: annotationWBS.yMax,
                    borderColor: 'black',
                    borderWidth: 2,
                    label: {
                      enabled: true,
                      content: 'WBS',
                      backgroundColor: 'transparent',
                      color: 'black',
                      padding: 10,
                      xAdjust: -20,
                      yAdjust: -20,
                      font: { style: 'bold', size: 18 },
                    },
                  }
                : null,
            },
          },
        },
      },
      ////////////////////////////////////////
    })
    return () => myChart.destroy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importedData])

  return (
    <LogLogWrapper>
      <canvas
        id='canvasID'
        ref={chartRef}
        style={{ cursor: 'crosshair' }}
      ></canvas>
      <div className='drawButtons'>
        <button
          type='button'
          onClick={handleIARF}
          className={IARF ? 'active' : null}
        >
          Draw IARF line
        </button>
        <button
          type='button'
          onClick={handleWBS}
          className={WBS ? 'active' : null}
        >
          Draw WBS line
        </button>
      </div>
      <ResultLoglog
        type='Log Log Diagnostic plot'
        timeIARF={timeIARF}
        pressureChangeIARF={pressureChangeIARF}
        pressureDerivativeIARF={pressureDerivativeIARF}
        timeWBS={timeWBS}
        pressureWBS={pressureWBS}
      />
    </LogLogWrapper>
  )
}

const LogLogWrapper = styled.div`
  display: grid;
  grid-auto-rows: min-content;
  place-content: top;
  grid-row-gap: 2rem;
  margin-top: 1rem;

  button {
    padding: 0.8rem;
    margin: 0 1rem;
    border: 1px solid #000;
    cursor: pointer;
  }

  .active {
    background: green;
    color: #fff;
  }

  .drawButtons {
    place-self: center;
  }
`

export default LogLog

// import { shapeSimilarity } from 'curve-matcher'
// import {
//   gringarten_arr,
//   bourdet_arr,
//   dimensionlessGroupArray,
// } from '../gringarten-bourdet'

////////////////////////////////////////////////////////////////
//check similarity with gringarten-bourdet type curves and determine dimensionless group
////////////////////////////////////////////////////////////////
// const curve_pressureChangeData = pressureChangeData.map((item) => {
//   return { x: item[0], y: item[1] }
// })

// const curve_derivativePressureData = derivativePressureData.map((item) => {
//   return { x: item[0], y: item[1] }
// })

// const similarity_gringarten = gringarten_arr.map((item) => {
//   return shapeSimilarity(curve_pressureChangeData, item)
// })
// const similarity_bourdet = bourdet_arr.map((item) => {
//   return shapeSimilarity(curve_derivativePressureData, item)
// })

// const sum_similarities = similarity_gringarten.map(
//   (item, index) => item + similarity_bourdet[index]
// )

// const indexOfMaxSimilarity = sum_similarities.indexOf(
//   Math.max(...sum_similarities)
// )

// const dimensionlessGroup = dimensionlessGroupArray[indexOfMaxSimilarity]

// console.log('gringarten', similarity_gringarten)
// console.log('bourdet', similarity_bourdet)
// console.log(sum_similarities)
// console.log(indexOfMaxSimilarity)
// console.log(dimensionlessGroup)
/////////////////////////////////////////////////////////////////
