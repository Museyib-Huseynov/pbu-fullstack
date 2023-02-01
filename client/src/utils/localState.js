import { useState } from 'react'

const useLocalState = () => {
  const [alertText, setAlertText] = useState({
    show: false,
    text: '',
    type: 'danger',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const showAlertText = ({ text, type = 'danger' }) => {
    setAlertText({ show: true, text, type })
  }

  const hideAlertText = () => {
    setAlertText({ show: false, text: '', type: 'danger' })
  }

  return {
    alertText,
    showAlertText,
    hideAlertText,
    loading,
    setLoading,
    success,
    setSuccess,
  }
}

export default useLocalState
