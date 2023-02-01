import {
  Navbar,
  CalculationPage,
  Login,
  NotFound,
  Verify,
  ProtectedRoute,
  ForgotPassword,
  ResetPassword,
} from './pages'
import { IndexRouteElement } from './components'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import styled from 'styled-components'
import { MDH, Horner, Agarwal } from './charts'
import { useGlobalUserContext } from './context/global_user_context'
import ReactLoading from 'react-loading'

function App() {
  const { isLoading } = useGlobalUserContext()
  if (isLoading) {
    return (
      <LoadingWrapper>
        <ReactLoading
          type='spin'
          color='rgba(7,96,246, 0.5)'
          height={200}
          width={100}
        />
      </LoadingWrapper>
    )
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <Navbar />
            </ProtectedRoute>
          }
        >
          <Route path='' element={<CalculationPage />}>
            <Route index element={<IndexRouteElement />} />
            <Route path='mdh' element={<MDH />} />
            <Route path='horner' element={<Horner />} />
            <Route path='agarwal' element={<Agarwal />} />
          </Route>
        </Route>
        <Route path='/login' element={<Login />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/user/reset-password' element={<ResetPassword />} />
        <Route path='/user/verify-email' element={<Verify />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

const LoadingWrapper = styled.div`
  height: 100vh;
  display: grid;
  place-content: center;
  place-items: center;
`

export default App
