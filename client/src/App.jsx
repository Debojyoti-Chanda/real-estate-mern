import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

/**
 * @description layout or the landing page is created
 * @returns
 */
function App() {
  return (
    <>
      <div className="flex flex-col min-h-screen justify-between">
        <Header />
        {/* <div className='text-3xl font-bold underline'>App</div> */}
        <Outlet />
        <Footer />
      </div>
    </>
  );
}

export default App;
