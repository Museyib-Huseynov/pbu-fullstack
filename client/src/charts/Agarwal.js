import { useRef, useEffect } from 'react'
import { ResultSemilog } from '../components'
import { useInputContext } from '../context/input_context'
import styled from 'styled-components'
import { Chart, registerables } from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import { getRelativePosition } from 'chart.js/helpers'
import regression from 'regression'

Chart.register(...registerables, annotationPlugin)

function Agarwal() {
  const chartRef = useRef(null)
  const {
    importedData,
    productionTime,
    agarwalRegression,
    setAgarwalRegression,
    agarwalAnnotation,
    setAgarwalAnnotation,
  } = useInputContext()

  let Agarwal_data = []
  if (productionTime) {
    Agarwal_data = importedData.map((item) => [
      Math.log10((+productionTime * item[0]) / (+productionTime + item[0])),
      item[1],
    ])
  }

  useEffect(() => {
    const myChart = new Chart(chartRef.current, {
      type: 'scatter',
      ////////////////////////////////////////////
      data: {
        datasets: [
          {
            data: Agarwal_data,
            backgroundColor: 'green',
          },
        ],
      },
      ////////////////////////////////////////////
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Log (Equivalent time)',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Pressure, psi',
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Agarwal Equivalent-Time method',
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
            annotations: agarwalAnnotation
              ? {
                  line1: {
                    type: 'line',
                    xMin: agarwalAnnotation.xMin,
                    yMin: agarwalAnnotation.yMin,
                    xMax: agarwalAnnotation.xMax,
                    yMax: agarwalAnnotation.yMax,
                    borderColor: 'black',
                    borderWidth: 2,
                    label: {
                      enabled: true,
                      content: agarwalRegression?.string,
                      backgroundColor: 'transparent',
                      color: 'black',
                      padding: 10,
                      xAdjust: -150,
                      yAdjust: -10,
                    },
                  },
                }
              : null,
          },
        },
        onClick: (e) => {
          if (myChart) {
            const canvasPosition = getRelativePosition(e, myChart)
            const dataX = myChart.scales.x.getValueForPixel(canvasPosition.x)

            const regressionArray = []
            for (let item of Agarwal_data) {
              if (item[0] >= dataX) {
                regressionArray.push(item)
              }
            }

            const result = regression.linear(regressionArray)
            setAgarwalRegression(result)

            if (result.r2) {
              //check to see when click out of range no error in console
              myChart.options.plugins.annotation.annotations = {
                line1: {
                  type: 'line',
                  xMin: dataX - 0.5,
                  yMin: result.predict(dataX - 0.5)[1],
                  xMax: regressionArray[regressionArray.length - 1][0],
                  yMax: result.predict(
                    regressionArray[regressionArray.length - 1][0]
                  )[1],
                  borderColor: 'black',
                  borderWidth: 2,
                  label: {
                    enabled: true,
                    content: result.string,
                    backgroundColor: 'transparent',
                    color: 'black',
                    padding: 10,
                    xAdjust: -150,
                    yAdjust: -10,
                  },
                },
              }
              setAgarwalAnnotation({
                xMin: dataX - 0.5,
                yMin: result.predict(dataX - 0.5)[1],
                xMax: regressionArray[regressionArray.length - 1][0],
                yMax: result.predict(
                  regressionArray[regressionArray.length - 1][0]
                )[1],
              })
            }
            myChart.update()
          }
        },
      },
      ////////////////////////////////////////
    })
    return () => myChart.destroy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importedData, productionTime])

  return (
    <AgarwalWrapper>
      <canvas ref={chartRef} style={{ cursor: 'crosshair' }}></canvas>
      <ResultSemilog
        type='Agarwal Equivalent-Time method'
        regressionLine={agarwalRegression}
      />
    </AgarwalWrapper>
  )
}

const AgarwalWrapper = styled.div`
  display: grid;
  place-items: center;
  grid-row-gap: 1rem;
`

export default Agarwal
