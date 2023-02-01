import React from 'react'
import styled from 'styled-components'
import { useInputContext } from '../context/input_context'
import { useGlobalContext } from '../context/global_context'

const InputElement = ({ type, label, marginTop }) => {
  const { setInput, ...state } = useInputContext()
  const { fieldsEmpty } = useGlobalContext()
  return (
    <InputElementWrapper marginTop={marginTop}>
      <label htmlFor={type}>
        {typeof label === 'object'
          ? label.map((item, index) => (
              <React.Fragment key={index}>{item}</React.Fragment>
            ))
          : label}
      </label>
      <input
        type={type === 'field' ? 'text' : 'number'}
        id={type}
        name={type}
        value={state[type]}
        onChange={setInput}
        className={fieldsEmpty && state[type] === '' ? 'warning' : ''}
      />
    </InputElementWrapper>
  )
}

const InputElementWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  justify-items: space-between;
  margin-top: ${(props) => (props.marginTop === true ? '1rem' : 0)};

  label {
    place-self: center;
  }

  input {
    padding: 0.5rem;
    width: 5rem;
    text-align: center;
    outline: none;
    border: 1px solid #a1a1a1;
    border-radius: 10px;
    margin: auto;
  }

  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type='number'] {
    -moz-appearance: textfield;
  }

  .warning {
    border: 2px solid red;
  }
`

export default InputElement
