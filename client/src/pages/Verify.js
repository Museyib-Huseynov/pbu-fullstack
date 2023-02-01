import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ReactLoading from 'react-loading';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context/global_context';

function Verify() {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const { host } = useGlobalContext();

  const verifyToken = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${host}/api/v1/auth/verify-email`, {
        verificationToken: searchParams.get('token'),
        email: searchParams.get('email'),
      });
      navigate('/login');
    } catch (error) {
      console.log(error);
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    verifyToken();
  }, []);

  if (loading) {
    return (
      <VerifyWrapper>
        <ReactLoading
          type='spin'
          color='rgba(7,96,246, 0.5)'
          height={200}
          width={100}
        />
      </VerifyWrapper>
    );
  }

  if (error) {
    return (
      <VerifyWrapper>
        <h1>There was an error, please double check your verification link </h1>
      </VerifyWrapper>
    );
  }
}

const VerifyWrapper = styled.div`
  height: 100vh;
  display: grid;
  place-content: center;
  place-items: center;
`;

export default Verify;
