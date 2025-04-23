
import React from 'react'
import AdminNav from '../../components/navbar/AdminNav'

const Schedule = () => {
  return (
    <>
      <div className='w-screen min-h-[79.8rem] h-screen bg-[#F0F0F0] select-none flex pt-[7rem]'>
        <div className='bg-[#1C1B19] w-auto min-h-full h-full min-w-[6rem] sm:min-w-auto'>
          <AdminNav />
        </div>

        <div className='w-full bg-[#F0F0F0] min-h-full h-full flex flex-col gap-y-10 px-7 pb-7 pt-[4rem] overflow-scroll'>
          <span className=' text-5xl font-semibold text-black'>Schedule</span>
          <div className='w-full h-full flex flex-col xl:flex-row  gap-y-5 xl:gap-y-0 justify-between sm:px-12'>

            <div className='sm:[w-31rem] h-full flex flex-col justify-between items-center pt-20'>
              {/* left tab */}
              <div className='min-w-[31rem] max-w-[31rem] min-h-[28rem] flex flex-col justify-between gap-y-5'>
                <span className='text-2xl font-semibold'>April</span>
                <div className='w-full h-full rounded-xl bg-black shadow-xl'>
                  {/* Calendar Area */}


                </div>
              </div>
              <div className='min-w-[31rem] max-w-[31rem] flex flex-col min-h-[26rem] gap-y-4 bg-white rounded-xl pt-10 shadow-xl'>
                {/* today scheduled tours */}
                <span className='text-2xl font-semibold'>Today’s Scheduled Tours</span>

                <div className='w-full h-full border-t-1 border-gray-400'>
                  {/* schedule cards */}


                </div>


              </div>
            </div>

            <div className='min-w-full xl:min-w-[55rem] xl:max-w-[55rem] 2xl:max-w-[90rem] 2xl:min-w-[90rem] h-full flex flex-col gap-y-8'>
              {/* middle tab */}
              <div className='w-full min-h-[5rem] flex flex-col justify-between'>
                <span className='text-4xl font-bold text-black'>Today’s Schedule</span>
                <div className='w-full h-fit flex'>
                  <span className='text-3xl font-bold text-[#9590FF]'>Thursday 17</span>
                  &nbsp;
                  &nbsp;

                  <i class="text-3xl fa-solid fa-less-than cursor-pointer"></i>
                  &nbsp;
                  &nbsp;
                  <i class="text-3xl fa-solid fa-greater-than cursor-pointer"></i>
                </div>
              </div>

              <div className='w-full h-full flex gap-x-2'>
                {/* calendar schdule */}

                <div className='h-full min-w-[4rem] rounded-xl bg-black shadow-xl'>
                  {/* time bar */}
                </div>

                <div className='w-full h-full flex flex-col gap-y-2'>
                  <div className='w-full min-h-[4rem] rounded-xl bg-black flex items-center px-5 shadow-xl'>
                    <span className='text-white text-3xl font-semibold'>Good Morning!</span>
                  </div>
                  <div className='w-full min-h-[4rem] rounded-xl bg-black flex items-center px-5 shadow-xl'>
                    <span className='text-white text-3xl font-semibold'>Hello</span>
                  </div>

                  <div className='2xl:h-[53rem] h-[41rem] min-w-full shadow-xl bg-white rounded-xl'>
                    {/* devil display cards */}




                  </div>


                  <div className='w-full min-h-[4rem] rounded-xl bg-black flex items-center px-5 shadow-xl'>
                    <span className='text-white text-3xl font-semibold'>Hello</span>
                  </div>
                </div>

              </div>


            </div>
            <div className='min-w-[31rem] h-full flex flex-col gap-y-5'>
              <div className='w-full min-h-[10rem] flex items-center justify-center gap-x-10 rounded-xl bg-white px-8 shadow-xl'>
                <i class="text-7xl fa-solid fa-clock"></i>
                <div className='w-[15rem] h-fit flex flex-col'>
                  <span className='text-5xl font-bold'>12:00pm</span>
                  <span className='text-3xl font-semibold text-end text-[#9590FF]'>Lunch Time</span>
                </div>
              </div>
              <div className='w-full min-h-[20rem] rounded-xl bg-white shadow-xl p-5 items-center flex flex-col gap-64'>
                <div className='w-full h-fit'>
                  <span className='text-2xl font-semibold'>Add a Schedule for <span className='text-[#A6A3F6]'>April 17</span></span>
                </div>
                {/* form for event title decription and time start, end */}
              </div>

              <div className='w-full h-full shadow-xl bg-white rounded-xl'>
                {/* School Fieldtrip */}
              </div>
            </div>
          </div>



        </div>

      </div>
    </>
  )
}

export default Schedule
