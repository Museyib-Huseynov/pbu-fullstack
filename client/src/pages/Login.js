import { useState } from 'react';
import styled from 'styled-components';
import { FaUser, FaLock } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { AiOutlineUser } from 'react-icons/ai';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useGlobalUserContext } from '../context/global_user_context';
import { useGlobalContext } from '../context/global_context';
import ReactLoading from 'react-loading';

function Login() {
  const [login, setLogin] = useState(true);
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [afterRegister, setAfterRegister] = useState(false);
  const { user, saveUser } = useGlobalUserContext();
  const { host } = useGlobalContext();

  const navigate = useNavigate();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { username, email, password } = values;
    const loginUser = { email, password };
    const registerUser = { name: username, email, password };
    if (login) {
      try {
        setAuthError(false);
        const { data } = await axios.post(
          `${host}/api/v1/auth/login`,
          loginUser,
          { withCredentials: true }
        );
        setValues({ email: '', password: '' });
        setLoading(false);
        saveUser(data.user);
        navigate('/mdh');
      } catch (error) {
        setAuthError(true);
        setLoading(false);
      }
    } else {
      try {
        const { data } = await axios.post(
          `${host}/api/v1/auth/register`,
          registerUser,
          { withCredentials: true }
        );
        setValues({ username: '', email: '', password: '' });
        setLoading(false);
        setAfterRegister(true);
        console.log(data.msg);
      } catch (error) {
        setLoading(false);
      }
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    const loginUser = {
      email: 'museyib.huseynov.dev@gmail.com',
      password: '3231292',
    };
    try {
      setAuthError(false);
      const { data } = await axios.post(
        `${host}/api/v1/auth/login`,
        loginUser,
        { withCredentials: true }
      );
      setValues({ email: '', password: '' });
      setLoading(false);
      saveUser(data.user);
      navigate('/mdh');
    } catch (error) {
      setAuthError(true);
      setLoading(false);
    }
  };

  const toggleLoginRegister = () => setLogin(!login);

  // console.log(user)
  if (user) {
    return <Navigate to='/mdh' replace={true} />;
  }

  if (loading) {
    return (
      <LoginWrapper>
        <ReactLoading
          type='spin'
          color='rgba(7,96,246, 0.5)'
          height={200}
          width={100}
        />
      </LoginWrapper>
    );
  }
  return (
    <LoginWrapper>
      <form onSubmit={onSubmit}>
        <AiOutlineUser className='main-icon' />
        <h1 className='header-login'>{login ? 'Login' : 'Register'}</h1>
        {!login && (
          <div className='icon-input-container'>
            <FaUser className='icon' />
            <input
              type='text'
              placeholder='Username'
              name='username'
              value={values.username}
              onChange={handleChange}
              autoComplete='off'
            />
          </div>
        )}
        <div className='icon-input-container'>
          <MdEmail className='icon' />
          <input
            type='text'
            placeholder='Email'
            name='email'
            value={values.email}
            onChange={handleChange}
            autoComplete='off'
          />
        </div>
        <div className='icon-input-container'>
          <FaLock className='icon' />
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={values.password}
            onChange={handleChange}
          />
        </div>
        {login && (
          <small onClick={() => navigate('/forgot-password')}>
            Forgot password?
          </small>
        )}
        {authError && <p className='authError'>Invalid Credentials</p>}
        <button type='submit' className='submit'>
          {login ? 'Login' : 'Register'}
        </button>
        <button type='button' onClick={handleDemo} className='demo'>
          Demo
        </button>
        {login ? (
          <p className='register-login'>
            Do not have an account ?{' '}
            <span onClick={toggleLoginRegister}>Register</span>
          </p>
        ) : (
          <p className='register-login'>
            Already have an account ?{' '}
            <span onClick={toggleLoginRegister}>Login</span>
          </p>
        )}
      </form>
      {afterRegister && (
        <h1 className='afterRegister'>Please verify your email</h1>
      )}
    </LoginWrapper>
  );
}

const LoginWrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
  align-items: center;
  background-color: #ffffff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%23D53AB5' stroke-width='1'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3Cpath d='M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764'/%3E%3Cpath d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880'/%3E%3Cpath d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/%3E%3Cpath d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/%3E%3C/g%3E%3Cg fill='%23505'%3E%3Ccircle cx='769' cy='229' r='5'/%3E%3Ccircle cx='539' cy='269' r='5'/%3E%3Ccircle cx='603' cy='493' r='5'/%3E%3Ccircle cx='731' cy='737' r='5'/%3E%3Ccircle cx='520' cy='660' r='5'/%3E%3Ccircle cx='309' cy='538' r='5'/%3E%3Ccircle cx='295' cy='764' r='5'/%3E%3Ccircle cx='40' cy='599' r='5'/%3E%3Ccircle cx='102' cy='382' r='5'/%3E%3Ccircle cx='127' cy='80' r='5'/%3E%3Ccircle cx='370' cy='105' r='5'/%3E%3Ccircle cx='578' cy='42' r='5'/%3E%3Ccircle cx='237' cy='261' r='5'/%3E%3Ccircle cx='390' cy='382' r='5'/%3E%3C/g%3E%3C/svg%3E");

  .demo {
    width: 60px;
    padding: 5px;
    place-self: center;
    background: green;
    border-radius: 6px;
    cursor: pointer;
  }
  form {
    width: 100%;
    max-width: 400px;
    height: 500px;
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

  small {
    place-self: end;
    cursor: pointer;
  }

  .register-login {
    place-self: center;
    font-size: 0.9rem;
    user-select: none;
  }

  span {
    font-size: 1rem;
    text-decoration: underline;
    cursor: pointer;
  }

  .afterRegister {
    background: yellow;
  }

  .authError {
    color: red;
    font-size: 1.2rem;
    place-self: center;
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
`;

export default Login;
