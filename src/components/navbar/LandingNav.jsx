import { Link, NavLink, useLocation } from 'react-router-dom'
import { useState } from 'react';

const LandingNav = () => {

  const location = useLocation();
  const isSpecialRoute = location.pathname === '/form' || location.pathname === '/about' || location.pathname === '/appointment' || location.pathname === '/support' ||  /^\/article\/[^/]+$/.test(location.pathname);;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
    <nav className='w-screen flex justify-center h-30  z-100 bg-transparent '>
        <div className={`w-[140rem] 3xl:w-[180rem] mx-5 md:mx-0 h-30 border-b-2 ${isSpecialRoute? ' border-b-black' : ' border-b-white'}`} >
          <div className='flex justify-between w-auto'>
           
            <div className='flex'>
               {/* Title and logo */}
              <img src="/LOGO.png" alt="" className='w-auto h-28'/>

              <div className='h-28 flex ml-3 items-center'>
                <div className={`h-24 rounded-2xl w-1 bg-white${isSpecialRoute ? 'drop-shadow-none ' : 'shadow-2xl shadow-black bg-white'}`}>

                </div>
                <Link to="/" className={`my-auto leading-none text-4xl font-bold ml-2 ${isSpecialRoute ? 'drop-shadow-none ' : 'drop-shadow-[1px_1px_0.5px_black] text-white'}`}> 
                    <span>Museo <br />Bulawan</span>
                </Link>
              </div>
            </div>
            
            <div className={`my-auto w-auto sm:w-[40rem] flex justify-center text-4xl items-center font-semibold ${isSpecialRoute ? 'drop-shadow-none' : 'text-white drop-shadow-[1px_1px_0.5px_black]'}`}>
              <button onClick={toggleMenu} className={`sm:hidden text-lg  focus:outline-none  ${isSpecialRoute? 'text-black':'text-white'}`}>
                {isMenuOpen ? (
                  <i className="fa-solid fa-bars-staggered"></i>
                ) : (
                <i className="fa-solid fa-bars"></i>

                )}

                <div
                  className={`fixed right-0 z-250 w-[18rem] text-left ${isMenuOpen ? 'block' : 'hidden'}  bg-[#1C1B19] `}>
                <NavLink to="/" className="block text-white px-4 py-2">Home</NavLink>
                <NavLink to="/content" className="block text-white px-4 py-2">News & Events</NavLink>
                <NavLink to="/about" className="block text-white px-4 py-2">About</NavLink>
              </div>
              </button>

              
          
              <div className='hidden sm:block'>
              <NavLink to="/" className='mx-4'>
                Home
              </NavLink>
              
              <NavLink to="/content" className='mx-4'>
                News & Events
              </NavLink>

              <NavLink to="/about" className='mx-4'>
                About
              </NavLink>

            </div>
              
            </div>
          
          </div>
          
        </div>
        
    </nav>
    </>
  )
}

export default LandingNav
