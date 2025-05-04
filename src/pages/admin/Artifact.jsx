import React, { useState } from 'react'
import AdminNav from '../../components/navbar/AdminNav'
import { ArtifactView, ArtifactAdd } from '../../components/modals/ArtifactModal'
import CustomDatePicker from '../../components/function/CustomDatePicker'


const Artifact = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isAddArtifactOpen, setIsAddArtifactOpen] = useState(false)

  const toggleArtifactModal = () => {
    setIsAddArtifactOpen(prev => !prev)
  }
  const closeArtifactModal = () => {
    setIsAddArtifactOpen(false)
  }

  return (
    <>
    {/* <ArtifactView/> */}
      <div className='w-screen min-h-[79.8rem] h-screen bg-[#F0F0F0] select-none flex pt-[7rem]'>
        <div className='bg-[#1C1B19] w-auto min-h-full h-full min-w-[6rem] sm:min-w-auto'>
          <AdminNav />
        </div>

        <div className='w-full min-h-full h-full flex flex-col gap-y-10 px-7 pb-7 pt-[4rem] overflow-scroll'>
          
          
          {isAddArtifactOpen ? (<ArtifactAdd onClose={closeArtifactModal} />) : (
          <>
          <span className=' text-5xl font-semibold'>Inventory</span>
          <div className='w-full h-full flex flex-col xl:flex-row gap-y-5 xl:gap-y-0 xl:gap-x-5 '>
            <div className='min-w-[34rem] h-full flex flex-col gap-y-7'>
              {/* info bar */}
              <div className='w-full max-w-[35rem] text-gray-500 min-h-[5rem] flex  py-2 gap-x-2'>
                <button className='px-4 h-full border-1 border-gray-500 rounded-lg cursor-pointer'>
                  <span className='text-2xl font-semibold'>Artifact</span>
                </button>
                <button className='px-4 h-full border-1 border-gray-500  rounded-lg cursor-pointer'>
                  <span className='text-2xl font-semibold'>Acquired</span>
                </button>
                <button className='px-4 h-full border-1 border-gray-500  rounded-lg cursor-pointer'>
                  <span className='text-2xl font-semibold'>Borrowing</span>
                </button>
              </div>

              <div className='w-full h-full flex flex-col gap-y-[5rem]'>
                <div className='bg-[#161616] px-4 h-[5rem] flex justify-between items-center rounded-sm'>
                  <span className='text-2xl text-white font-semibold'>Total Artifacts</span>
                  <div className='w-[6rem] h-[3rem] bg-[#D4DBFF] flex items-center justify-center rounded-md'>
                    <span className='text-2xl text-black font-semibold'>255</span>
                  </div>
                </div>

                <div className='w-full h-auto flex flex-col gap-y-7'>
                  {/* Date */}
                  <span className='text-2xl font-semibold text-[#727272]'>January 8, 2025</span>
                  <div className='w-full h-fit flex justify-between items-center'>
                    <span className='text-2xl font-semibold '>Acquired</span>
                    <div className='w-[5rem] h-[2rem] flex items-center bg-[#D4DBFF] rounded-md justify-center'>
                      <span className='text-2xl font-semibold'>545</span>
                    </div>
                  </div>

                  <div className='w-full h-fit flex justify-between items-center'>
                    <span className='text-2xl font-semibold '>Borrowing</span>
                    <div className='w-[5rem] h-[2rem] flex items-center bg-[#D4DBFF] rounded-md justify-center'>
                      <span className='text-2xl font-semibold'>10</span>
                    </div>
                  </div>

                  <div className='w-full h-fit flex justify-between items-center'>
                    <span className='text-2xl font-semibold '>Unfinished Edit</span>
                    <div className='w-[5rem] h-[2rem] flex items-center bg-[#D4DBFF] rounded-md justify-center'>
                      <span className='text-2xl font-semibold'>5</span>
                    </div>
                  </div>

                  <div className='w-full h-fit flex justify-between items-center'>
                    <span className='text-2xl font-semibold '>On Display</span>
                    <div className='w-[5rem] h-[2rem] flex items-center bg-[#D4DBFF] rounded-md justify-center'>
                      <span className='text-2xl font-semibold'>255</span>
                    </div>
                  </div>

                  <button onClick={toggleArtifactModal} className='cursor-pointer w-full h-[5rem] flex justify-between items-center bg-[#6BFFD5]'>
                    <span className='text-2xl font-semibold ml-[1rem]'>Add New Artifacts</span>
                    <div className='w-[3rem] h-[3rem] flex items-center bg-[#D4DBFF] rounded-full border-2 border-[#000000] justify-center mr-[1rem]'>
                      <i className="fas fa-plus text-3xl"></i>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className=' w-full h-full flex flex-col gap-y-7 overflow-x-scroll overflow-y-scroll'>
              {/* table */}
              <div className='min-w-[94rem] min-h-[5rem] py-2 flex items-center gap-x-2'>
                {/* 3) Use CustomDatePicker instead of a plain button */}
                <div className='flex-shrink-0'>
                  <CustomDatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    popperPlacement="bottom-start"
                    popperClassName="z-50"
                    customInput={
                      <button className='px-3 h-16 rounded-lg border-1 border-gray-500 cursor-pointer'>
                        <i className="text-gray-500 fa-regular fa-calendar text-4xl"></i>
                      </button>
                    }
                  />
                </div>

                <div className="relative h-full min-w-[20rem]">
                  <i className="text-2xl fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"></i>
                  <input
                    type="text"
                    placeholder="Search History"
                    className="h-full pl-10 pr-3 py-2 border-1 border-gray-500 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="relative h-full  min-w-48">
                  <input
                    type="text"
                    placeholder="Filter..."
                    className="pl-4 h-full text-2xl pr-8 py-2 border-1 border-gray-500  rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <i className="cursor-pointer text-2xl fas fa-plus absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
                </div>

                <div className="relative h-full min-w-48">
                  <select className="appearance-none border-1 border-gray-500  h-full text-2xl rounded-lg text-gray-500 w-full py-2 pl-4 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All Actions</option>
                    <option>Action 1</option>
                    <option>Action 2</option>
                  </select>
                  <i className="text-2xl fas fa-caret-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"></i>
                </div>
              </div>

              <div className="min-w-[94rem] w-full font-semibold h-fit grid grid-cols-6 justify-between">
                {/* table headers */}
                <div className="text-[#727272] text-2xl border-l px-3 py-2 col-span-1">
                  <span>Date</span>
                </div>
                <div className="text-[#727272] text-2xl border-l px-3 py-2 col-span-2">
                  <span>Title</span>
                </div>
                <div className="text-[#727272] text-2xl border-l px-3 py-2 col-span-1">
                  <span>Type</span>
                </div>
                <div className="text-[#727272] text-2xl border-l px-3 py-2 col-span-1">
                  <span>Display Status</span>
                </div>
                <div className="text-[#727272] text-2xl border-l px-3 py-2 col-span-1">
                  <span>Updated</span>
                </div>
              </div>


              
                <div className="w-full min-w-[94rem] h-auto flex flex-col border-t border-t-gray-400">
                {/* table data */}
                <div className="min-w-[94rem] text-xl h-fit font-semibold grid grid-cols-6 justify-between cursor-pointer hover:bg-gray-300">
                  <div className="px-4 pt-1 pb-3 border-b border-gray-400 col-span-1">
                    <span>02-19-2024</span>
                  </div>
                  <div className="px-4 pt-1 pb-3 border-b border-gray-400 col-span-2">
                  <span>Perlas ng silanganan</span>

                  </div>
                  <div className="px-4 pt-1 pb-3 border-b border-gray-400 col-span-1">
                  <span>Lending</span>

                  </div>
                  <div className="px-4 py-4 border-b border-gray-400 col-span-1">
                    <span className="text-white bg-[#9C7744] border border-black rounded-md px-4 py-1">
                      Accepted
                    </span>
                  </div>
                  <div className="px-4 py-4 border-b border-gray-400 col-span-1">
                  <span>02-19-2024</span>

                  </div>
                </div>

                  

                {/* Additional rows follow the same pattern */}
              </div>
            </div>
          </div>
          </>
          )
          }
        </div>
      </div>
    </>
  )
}

export default Artifact