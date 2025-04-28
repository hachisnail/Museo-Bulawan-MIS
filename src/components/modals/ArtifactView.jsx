import React from 'react'

const ArtifactView = () => {
  return (
    <>
    <div className='w-screen h-screen fixed  backdrop-blur-xs  z-50 flex flex-col gap-y-4 items-center justify-center select-none'>
        
        <div className='w-[60rem] xl:w-[120rem] min-h-15 bg-white shadow-2xl rounded-xl flex justify-end items-center px-5'>
            <i class="fa-solid fa-xmark text-3xl cursor-pointer"></i>
        </div>
        <div className='w-[60rem] xl:w-[120rem] h-[60rem] min-h-[60rem] flex flex-col gap-y-4 overflow-y-scroll'>
            

            <div className='w-full h-fit flex flex-col bg-white shadow-2xl rounded-xl'>
                <div className='w-full min-h-15 flex justify-end items-center px-4'>
                    <i class="fas fa-edit text-black text-3xl cursor-pointer" ></i>
                </div>
                <div className='w-[50rem] xl:w-[110rem] flex flex-col gap-y-10 min-h-[52rem] mx-auto pt-10'>
                     <span className='text-5xl font-semibold'>Perlas ng Silanganan</span> {/* title of the artifact*/}
                     <div className='w-full h-fit flex xl:flex-row flex-col xl:justify-between  gap-y-10'>
                        <div className='w-[50rem] h-[40rem] flex justify-between'>
                            {/* picture container */}
                            <div className='flex flex-col justify-between'>
                                <div className='w-[9rem] h-[9rem] border-1'>

                                </div>
                                <div className='w-[9rem] h-[9rem] border-1'>

                                </div>
                                <div className='w-[9rem] h-[9rem] border-1'>

                                </div>
                                <div className='w-[9rem] h-[9rem] border-1'>

                                </div>
                            </div>
                            <div className='w-[40rem] h-[40rem] border-1'>

                            </div>
                        </div>

                        <div className='w-[57rem] h-[40rem] flex flex-col gap-y-5'>
                            {/* artifact metadata */}
                            <span className='text-3xl font-semibold w-fit'>Date of Creation:</span>
                            <span className='text-3xl font-semibold w-fit'>Origin/Provenance:</span>
                            <span className='text-3xl font-semibold w-fit'>Current Location:</span>
                            <span className='text-3xl font-semibold w-fit'>Culture or Civilization:</span>
                            <span className='text-3xl font-semibold w-fit'>Period/Era:</span>
                            <span className='text-3xl font-semibold w-fit'>Discovery Details:</span>
                            <span className='text-3xl font-semibold w-fit'>Excavation Site:</span>
                            <span className='text-3xl font-semibold w-fit'>Collection/Accession Number:</span>
                            <span className='text-3xl font-semibold w-fit'>Acquisition History:</span>
                        </div>
                     </div>
                </div>
            </div>

            <div className='w-full h-auto flex xl:flex-row flex-col gap-x-4 gap-y-4 pb-20'>
                <div className='min-w-[40rem] min-h-[90rem] flex flex-col gap-y-4'>
                    <div className='w-full min-h-[30rem] bg-white rounded-xl shadow-2xl'>

                    </div>
                    <div className='w-full h-full bg-white rounded-xl shadow-2xl'>

                    </div>
                </div>
                
                <div className='w-full h-[90rem] bg-white rounded-xl shadow-2xl'>

                </div>

            </div>
        </div>

    </div>
    </>
  )
}

export default ArtifactView
