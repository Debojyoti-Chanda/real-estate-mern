import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'

/**
 * @description layout or the landing page is created 
 * @returns 
 */
function App() {


  return (
    <>
      <Header/>
      {/* <div className='text-3xl font-bold underline'>App</div> */}
      <Outlet />
      <Footer/>
    </>
  )
}

export default App
