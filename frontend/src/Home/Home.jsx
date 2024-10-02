import React from 'react'
import Navbar from '../Components/Navbar'
import '../Home/Home.css'
import '../index.css';


function Home() {
  return (
    <div>
        <Navbar/>
        <div className='text-3xl font-bold underline'>
          Hello World
        </div>
    </div>
  )
}

export default Home