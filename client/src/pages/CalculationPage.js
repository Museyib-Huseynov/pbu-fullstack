import { Outlet, NavLink } from 'react-router-dom'
import { Input } from '../components'
import styled from 'styled-components'
import { useInputContext } from '../context/input_context'
import { PressureTime, LogLog } from '../charts'

const CalculationPage = () => {
  const { importedData } = useInputContext()

  return (
    <CalculationPageWrapper>
      <Input />
      {importedData.length !== 0 && (
        <>
          <div className='graphs'>
            <PressureTime />
            <nav className='links'>
              <NavLink
                to='/mdh'
                className={({ isActive }) =>
                  isActive ? 'link active' : 'link'
                }
              >
                MDH
              </NavLink>
              <NavLink
                to='/horner'
                className={({ isActive }) =>
                  isActive ? 'link active' : 'link'
                }
              >
                Horner
              </NavLink>
              <NavLink
                to='/agarwal'
                className={({ isActive }) =>
                  isActive ? 'link active' : 'link'
                }
              >
                Agarwal Equivalent-Time
              </NavLink>
            </nav>
            <Outlet />
          </div>
          <LogLog />
        </>
      )}
    </CalculationPageWrapper>
  )
}

const CalculationPageWrapper = styled.div`
  height: calc(100vh - 5rem);
  display: grid;
  grid-template-columns: 350px 600px 700px;
  column-gap: 2rem;

  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */

  .graphs {
    display: grid;
    grid-auto-flow: row;
    grid-auto-rows: min-content;
    grid-row-gap: 1rem;
    padding: 5px 10px;
    // grid-gap: 2rem;
    margin-top: 1rem;
  }

  .links {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: repeat(3, 1fr);
    // margin-bottom: 2rem;
    // place-items: center;
  }

  .link {
    width: 100%;
    text-align: center;
    border: 2px solid green;
    color: #000;
    padding: 10px 0;
  }

  .link:nth-child(2) {
    border-left: none;
    border-right: none;
  }

  .active {
    background: green;
    color: white;
  }

  .diagnostic {
    width: 80%;
    place-self: center;
    display: grid;
    justify-content: center;
  }
`
export default CalculationPage
