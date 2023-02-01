import { useState } from 'react'
import styled from 'styled-components'
import { FaLock } from 'react-icons/fa'
import useLocalState from '../utils/localState'
import axios from 'axios'
import { useSearchParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../context/global_context'

function ResetPassword() {
  const [password, setPassword] = useState('')
  const [searchParams] = useSearchParams()

  const navigate = useNavigate()
  const { host } = useGlobalContext()

  const {
    alertText,
    showAlertText,
    hideAlertText,
    loading,
    setLoading,
    success,
    setSuccess,
  } = useLocalState()

  const handleChange = (e) => {
    setPassword(e.target.value)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    hideAlertText()
    if (!password) {
      showAlertText({
        text: 'Please enter password',
      })
      setLoading(false)
      return
    }

    try {
      const { data } = await axios.post(`${host}/api/v1/auth/reset-password`, {
        password,
        token: searchParams.get('token'),
        email: searchParams.get('email'),
      })
      showAlertText({ text: data.msg, type: 'success' })
      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (error) {
      showAlertText({ text: error.response.data.msg })
      setSuccess(true)
    }
    setLoading(false)
  }

  return (
    <ResetPasswordWrapper>
      {!success && (
        <form onSubmit={onSubmit}>
          <h1 className='header-login'>Reset password </h1>
          <div className='icon-input-container'>
            <FaLock className='icon' />
            <input
              type='password'
              name='password'
              placeholder='Password'
              value={password}
              onChange={handleChange}
              autoComplete='off'
            />
          </div>
          <button type='submit' className='submit'>
            {loading ? 'Please wait...' : 'New password'}
          </button>
        </form>
      )}
      {alertText.show && <div className='alertText'>{alertText.text}</div>}
    </ResetPasswordWrapper>
  )
}

const ResetPasswordWrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
  align-items: center;
  background-color: #ffffff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%23D53AB5' stroke-width='1'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3Cpath d='M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764'/%3E%3Cpath d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880'/%3E%3Cpath d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/%3E%3Cpath d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/%3E%3C/g%3E%3Cg fill='%23505'%3E%3Ccircle cx='769' cy='229' r='5'/%3E%3Ccircle cx='539' cy='269' r='5'/%3E%3Ccircle cx='603' cy='493' r='5'/%3E%3Ccircle cx='731' cy='737' r='5'/%3E%3Ccircle cx='520' cy='660' r='5'/%3E%3Ccircle cx='309' cy='538' r='5'/%3E%3Ccircle cx='295' cy='764' r='5'/%3E%3Ccircle cx='40' cy='599' r='5'/%3E%3Ccircle cx='102' cy='382' r='5'/%3E%3Ccircle cx='127' cy='80' r='5'/%3E%3Ccircle cx='370' cy='105' r='5'/%3E%3Ccircle cx='578' cy='42' r='5'/%3E%3Ccircle cx='237' cy='261' r='5'/%3E%3Ccircle cx='390' cy='382' r='5'/%3E%3C/g%3E%3C/svg%3E");

  form {
    width: 400px;
    height: 60%;
    background: #003;
    color: #fff;
    border-radius: 30px;
    display: grid;
    grid-auto-flow: row;
    grid-auto-columns: 80%;
    place-content: center;
    gap: 15px;
  }

  input {
    color: #fff;
    background: transparent;
    border: none;
    padding: 15px 20px;
    outline: none;
    caret-color: transparent;
    font-size: 0.9rem;
  }

  input:focus {
    caret-color: #fff;
  }

  input::placeholder {
    caret-color: transparent;
    user-select: none;
  }

  input:-webkit-autofill {
    -webkit-text-fill-color: #fff;
    -webkit-box-shadow: 0 0 0px 1000px #003 inset;
  }

  .icon-input-container {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 40px auto;
    border-bottom: 1px solid #b9b;
  }

  .icon {
    place-self: center;
    font-size: 30px;
    padding: 5px;
  }

  .main-icon {
    font-size: 60px;
    place-self: center;
  }

  .header-login {
    place-self: center;
    margin-bottom: 3rem;
    caret-color: transparent;
    user-select: none;
  }

  .alertText {
    background: yellow;
    font-size: 1.2rem;
  }

  .submit {
    font-size: 1rem;
    color: #fff;
    place-self: center;
    width: 90%;
    padding: 0.8rem;
    border-radius: 50px;
    border: none;
    outline: none;
    cursor: pointer;
    margin-top: 2rem;
    background-color: #ff63a1;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3CradialGradient id='a' cx='0' cy='800' r='800' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23ff56f7'/%3E%3Cstop offset='1' stop-color='%23ff56f7' stop-opacity='0'/%3E%3C/radialGradient%3E%3CradialGradient id='b' cx='1200' cy='800' r='800' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%237c4aff'/%3E%3Cstop offset='1' stop-color='%237c4aff' stop-opacity='0'/%3E%3C/radialGradient%3E%3CradialGradient id='c' cx='600' cy='0' r='600' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%233d73ff'/%3E%3Cstop offset='1' stop-color='%233d73ff' stop-opacity='0'/%3E%3C/radialGradient%3E%3CradialGradient id='d' cx='600' cy='800' r='600' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23FF63A1'/%3E%3Cstop offset='1' stop-color='%23FF63A1' stop-opacity='0'/%3E%3C/radialGradient%3E%3CradialGradient id='e' cx='0' cy='0' r='800' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23A348FF'/%3E%3Cstop offset='1' stop-color='%23A348FF' stop-opacity='0'/%3E%3C/radialGradient%3E%3CradialGradient id='f' cx='1200' cy='0' r='800' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%2332FFF3'/%3E%3Cstop offset='1' stop-color='%2332FFF3' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect fill='url(%23a)' width='1200' height='800'/%3E%3Crect fill='url(%23b)' width='1200' height='800'/%3E%3Crect fill='url(%23c)' width='1200' height='800'/%3E%3Crect fill='url(%23d)' width='1200' height='800'/%3E%3Crect fill='url(%23e)' width='1200' height='800'/%3E%3Crect fill='url(%23f)' width='1200' height='800'/%3E%3C/svg%3E");
    background-attachment: fixed;
    background-size: cover;
  }
`

export default ResetPassword
