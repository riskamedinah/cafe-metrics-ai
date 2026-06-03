import { CreateContext, useContext, useState } from "react";

const AuthContext = CreateContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'))

  const login = (userData, accessToken) => {
    localStorage.setItem('token', accessToken)
    localStorage.setItem('user', JSON.stringify(userData))
    setToken(accessToken)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

    return (
        <AuthContext.Provider value={{ token, user, login, logout, isAuth: !!token }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}

