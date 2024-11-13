import { useEffect } from 'react'

import { getTokenApi, logoutApi, isExpiredToken } from '../api/auth'

const useCheckSession = ({ setRefreshCheckLogin }) => {
  useEffect(() => {
    if (getTokenApi()) {
      if (isExpiredToken(getTokenApi())) {
        logoutApi()
        setRefreshCheckLogin(true)
      }
    }
  }, [])
}

export default useCheckSession
