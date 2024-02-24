import { useState } from 'react'
import { Outlet } from 'react-router-dom'

/**
 * @description layout or the landing page is created 
 * @returns 
 */
function App() {


  return (
    <>
      <div className='text-3xl font-bold underline'>App</div>
      <Outlet/>
    </>
  )
}

export default App
