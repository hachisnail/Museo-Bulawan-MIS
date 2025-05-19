import React from 'react'
import LandingNav from '../../components/navbar/LandingNav'
import { NavLink } from 'react-router-dom'
import { ScrollRestoration } from 'react-router-dom'
import backgroundImage from '../../../src/assets/Fernando-Amorsolo-Women-Bathing-and-Washing Clothes-7463.png'

const Support = () => {
  return (
    <>
      <ScrollRestoration />
      <div className="bg-white min-h-[79rem] h-screen w-screen pt-7">
        <div className="min-h-[10%] w-screen">
          <LandingNav />
        </div>
        <div className="max-w-[140rem] 3xl:max-w-[180rem] mx-auto min-h-[89%] flex flex-col sm:flex-row items-center justify-center sm:p-20 gap-y-10 sm:gap-x-20">
          <div className="w-full h-full flex flex-col sm:gap-y-10 gap-y-5">
            <div className="w-full min-h-fit px-5 sm:px-0">
              <span className="sm:text-[6rem] text-[2rem]  font-bold font-hina">
                Hello, let’s get in touch. <br />
                Do you want to donate/lend your artifact?
              </span>
            </div>
            <div className="w-full h-full px-5 sm:pl-20  text-justify">
              <span className="w-full h-full text-2xl sm:text-5xl font-hina">
                &nbsp;&nbsp;&nbsp;By supporting Museo Bulawan, you are not only
                helping to preserve important artifacts and historical objects
                but also contributing to the education and empowerment of future
                generations. This museum is more than just a place to view
                exhibits; it is a space for the community to connect, learn, and
                take pride in their shared heritage.
                <br />
              </span>
              <span className="w-full h-full text-2xl sm:text-5xl font-hina">
                &nbsp;&nbsp;&nbsp;We invite you to join us in this important
                endeavor. Your support can make a significant difference in
                ensuring that the identity of the Camnorteños continues to
                thrive, fostering a deeper sense of patriotism and pride in our
                community. Together, we can keep the spirit of Camarines Norte
                alive for generations to come.
              </span>
            </div>
          </div>
          <div className="min-w-fit min-h-full flex items-center justify-center">
            <div
              className="w-[40rem] h-[40rem] sm:w-[50rem] sm:h-[50rem] bg-no-repeat bg-cover bg-center p-10"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            >
              <div className="w-full h-full  outline-2 outline-white flex items-center justify-center">
                <div className="w-40 min-h-10 flex items-center justify-center outline-2 outline-[#867055]  bg-white xl:h-16 xl:w-60">
                  <NavLink to="/form">
                    <span className="text-2xl xl:text-4xl font-hina cursor-pointer">
                      FORM{' '}
                    </span>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Support
