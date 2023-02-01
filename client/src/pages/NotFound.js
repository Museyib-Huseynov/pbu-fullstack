import styled from 'styled-components'

function NotFound() {
  return (
    <NotFoundWrapper>
      <h1>Oops! There is nothing here!</h1>
    </NotFoundWrapper>
  )
}

const NotFoundWrapper = styled.main`
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
  font-size: 1.2rem;
`

export default NotFound
