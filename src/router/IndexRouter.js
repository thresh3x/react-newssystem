import React from 'react'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import Login from '../pages/login/Login'
import NewsSandBox from '../pages/sandbox/NewsSandBox'
import News from '../pages/news/News'
import Detail from '../pages/news/Detail'
export default function IndexRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/news' element={<News />}></Route>
        <Route path='/detail/:id' element={<Detail />}></Route>
        <Route path='*' element={
          localStorage.getItem('token') ? <NewsSandBox></NewsSandBox> : <Navigate to="/login"></Navigate>
        }></Route>
      </Routes>
    </BrowserRouter>
  )
}
