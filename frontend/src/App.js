/* eslint-disable react-hooks/exhaustive-deps */

import React, { useContext, useEffect } from 'react'
import { AuthContext } from './context'
import Navbar from './components/Navbar'
import { Routes, Route, Navigate } from 'react-router-dom'
import Signup from './pages/Signup'
import Confirmation from './pages/Confirmation'
import Login from './pages/Login'
import Home from './pages/Home'
import Upload from './pages/Upload'

const RequireAuth = ({ children }) => {
  const { state } = useContext(AuthContext)
  return state.auth ? children : <Navigate to='/login' replace />
}

const OnlyNotAuth = ({ children }) => {
  const { state } = useContext(AuthContext)
  return !state.auth ? children : <Navigate to='/' />
}

const App = () => {
  const { dispatch } = useContext(AuthContext)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('authUser'))
    if (user)
      dispatch({
        type: 'LOGIN',
        payload: {
          user: user,
          token: user?.token
        }
      })

    return () => {
      localStorage.clear()
    }
  }, [])
  return (
    <>
      <Navbar auth={false} />
      <Routes>
        <Route
          path='/'
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />

        <Route
          path='/upload'
          element={
            <RequireAuth>
              <Upload />
            </RequireAuth>
          }
        />

        <Route
          path='/signup'
          element={
            <OnlyNotAuth>
              <Signup />
            </OnlyNotAuth>
          }
        />
        <Route
          path='/login'
          element={
            <OnlyNotAuth>
              <Login />
            </OnlyNotAuth>
          }
        />
        <Route
          path='/verify/:confirmationToken'
          element={
            <OnlyNotAuth>
              <Confirmation />
            </OnlyNotAuth>
          }
        />
      </Routes>
    </>
  )
}

export default App
