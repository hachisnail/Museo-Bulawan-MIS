import React, { useEffect, useState } from 'react'

export const ConfirmationModal = ({ title, description, icon, onClose }) => {
  const [confirmEnabled, setConfirmEnabled] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(5)

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setConfirmEnabled(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const renderIcon = () => {
    switch (icon) {
      case 'warning':
        return <i className="fa-solid fa-triangle-exclamation text-3xl text-white"></i>
      case 'question':
        return <i className="fa-solid fa-question text-3xl text-white"></i>
      case 'info':
        return <i className="fa-solid fa-info text-3xl text-white"></i>
      default:
        return null
    }
  }

  const handleClose = (result) => {
    onClose(result) 
    //console.log(result);
  }

  return (
    <>
    <div className="w-screen h-screen fixed  z-60 flex items-center justify-center">
      <div className="w-[45rem] h-fit bg-[#1C1B19] border border-[#3A3A3A] flex flex-col rounded-sm">
        {/* Header */}
        <div className="w-full min-h-15 bg-[#373737] flex justify-between">
          <div className="h-15 w-fit flex items-center px-5">
            <span className="text-2xl text-white font-semibold">{title}</span>
          </div>
          <div className="w-15 h-15 flex items-center justify-center">
            {renderIcon()}
          </div>
        </div>

        {/* Body */}
        <div className="w-full h-full flex px-6 py-10">
          <span className="text-xl text-white">{description}</span>
        </div>

        {/* Footer */}
        <div className="w-full min-h-15 bg-[#373737] flex px-5 justify-end">
          <div className="w-fit h-15 flex items-center gap-x-2">
            <button className="hover:ring-3  w-30 h-8 bg-[#3A3A3A] border flex items-center justify-center border-white rounded cursor-pointer" onClick={() => handleClose(false)}>
              <span className="text-white text-xl font-semibold ">Cancel</span>
            </button>
            <button className={`hover:ring-3 w-30 h-8 ${confirmEnabled ? 'bg-[#FF8080] cursor-pointer' : 'bg-gray-500 cursor-not-allowed'} border flex items-center justify-center border-white rounded-sm`} onClick={() => confirmEnabled && handleClose(true)}disabled={!confirmEnabled}>
              <span className="text-white text-xl font-semibold">
                {confirmEnabled ? 'Confirm' : `Confirm (${secondsLeft})`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}


export const ConfirmationModalC = ({ title, description, icon, onClose }) => {
  const [confirmEnabled, setConfirmEnabled] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(5)

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setConfirmEnabled(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const renderIcon = () => {
    switch (icon) {
      case 'warning':
        return <i className="fa-solid fa-triangle-exclamation text-3xl text-white"></i>
      case 'question':
        return <i className="fa-solid fa-question text-3xl text-white"></i>
      case 'info':
        return <i className="fa-solid fa-info text-3xl text-white"></i>
      default:
        return null
    }
  }

  const handleClose = (result) => {
    onClose(result) 
    //console.log(result);
  }

  return (
    <>
    <div className="w-screen h-screen fixed  z-60 flex items-center justify-center">
      <div className="w-[45rem] h-fit bg-[#1C1B19] border border-[#3A3A3A] flex flex-col rounded-sm">
        {/* Header */}
        <div className="w-full min-h-15 bg-[#373737] flex justify-between">
          <div className="h-15 w-fit flex items-center px-5">
            <span className="text-2xl text-white font-semibold">{title}</span>
          </div>
          <div className="w-15 h-15 flex items-center justify-center">
            {renderIcon()}
          </div>
        </div>

        {/* Body */}
        <div className="w-full h-full flex px-6 py-10">
          <span className="text-xl text-white">{description}</span>
        </div>

        {/* Footer */}
        <div className="w-full min-h-15 bg-[#373737] flex px-5 justify-end">
          <div className="w-fit h-15 flex items-center gap-x-2">
            <button className="hover:ring-3  w-30 h-8 bg-[#3A3A3A] border flex items-center justify-center border-white rounded cursor-pointer" onClick={() => handleClose(false)}>
              <span className="text-white text-xl font-semibold ">Cancel</span>
            </button>
            <button className={`hover:ring-3 w-30 h-8 'bg-[#FF8080] cursor-pointer border flex items-center justify-center border-white rounded-sm`} onClick={() =>  handleClose(true)}>
              <span className="text-white text-xl font-semibold"> Confirm
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

