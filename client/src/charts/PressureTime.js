import { useRef, useEffect } from 'react'
import { useInputContext } from '../context/input_context'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

function PressureTime(props) {
  const chartRef = useRef(null)
  const { importedData } = useInputContext()

  useEffect(() => {
    const myChart = new Chart(chartRef.current, {
      ////////////////////////////////////////////
      type: 'scatter',
      ////////////////////////////////////////////
      data: {
        datasets: [
          {
            data: importedData,
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
              text: 'Time, hour',
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
            text: 'Pressure vs time',
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
        },
      },
      //////////////////////////////////////////////
    })
    return () => myChart.destroy()
  }, [importedData])

  return (
    <div>
      <canvas ref={chartRef} style={{ cursor: 'crosshair' }}></canvas>
    </div>
  )
}

export default PressureTime
