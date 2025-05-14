import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {ConfirmationModal} from '../../components/modals/ConfirmationModal'

const UserUpdate = ({ userId, onClose }) => {
  const [showConfirmation, setConfirmation] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showRePassword, setShowRePassword] = useState(false)
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [user, setUser] = useState(null)
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const API_URL = import.meta.env.VITE_API_URL;
    axios
      .get(`${API_URL}/api/auth/fetchUser/${userId}`, {
               withCredentials: true,

      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const fetchedUser = response.data
        setUser(fetchedUser)
        setRole(fetchedUser?.Credential?.role || 'staff')
        setLoading(false)
      })
      .catch((error) => {
        console.error(
          'Error fetching user:',
          error.response?.data || error.message
        )
        setLoading(false)
      })
  }, [userId])

  const handleConfirmation = (result) => {
    setConfirmation(false)
    console.log('User confirmed?', result)
  }

  return (
    <>
      <div className="w-screen h-screen fixed backdrop-blur-xs z-50 flex items-center justify-center select-none">
        {showConfirmation && (
          <ConfirmationModal
            title="Save Changes?"
            description="Are you sure you want to save the modifications made to this user's account? This action will update the current user information."
            icon="info"
            onClose={handleConfirmation}
          />
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            console.log('Form submitted!');
            setConfirmation(true)
          }}
          className="w-[43rem] min-h-fit bg-[#1C1B19] border-1 border-[#3A3A3A] flex flex-col rounded-sm"
        >
          <div className="w-full min-h-15 bg-[#373737] flex justify-between">
            <div className="h-15 w-fit flex items-center px-5">
              <span className="text-2xl text-white font-semibold">
                Update User
              </span>
            </div>
            <div className="w-15 h-15 flex items-center justify-center">
              <i className="fa-solid fa-user text-white text-3xl"></i>
            </div>
          </div>

          <div className="w-full h-full flex flex-col p-6 gap-y-2">
            <div className="w-full flex justify-between min-h-15">
              <div className="flex flex-col w-75 gap-y-2">
                <label
                  htmlFor="first-name"
                  className="text-xl text-white font-semibold"
                >
                  First Name
                </label>
                <input
                  placeholder="First Name"
                  id="first-name"
                  type="text"
                  defaultValue={user?.Credential?.first_name}
                  className="bg-[#242424] w-full h-15 rounded-sm border-[#373737] border px-4 text-lg text-white font-semibold hover:border-purple-500"
                />
              </div>

              <div className="flex flex-col w-75 gap-y-2">
                <label
                  htmlFor="last-name"
                  className="text-xl text-white font-semibold"
                >
                  Last Name
                </label>
                <input
                  placeholder="Last Name"
                  id="last-name"
                  type="text"
                  defaultValue={user?.Credential?.last_name}
                  className="bg-[#242424] w-full h-15 rounded-sm border-[#373737] border px-4 text-lg text-white font-semibold hover:border-purple-500"
                />
              </div>
            </div>

            <label htmlFor="email" className="text-xl text-white font-semibold">
              Email
            </label>
            <input
              placeholder="Email"
              id="email"
              type="text"
              defaultValue={user?.Credential?.email}
              className="bg-[#242424] w-full h-15 rounded-sm border-[#373737] border px-4 text-lg text-white font-semibold hover:border-purple-500"
            />

            <label
              htmlFor="position"
              className="text-xl text-white font-semibold"
            >
              Position
            </label>
            <input
              placeholder="Position"
              id="position"
              type="text"
              defaultValue={user?.Credential?.position}
              className="bg-[#242424] w-full h-15 rounded-sm border-[#373737] border px-4 text-lg text-white font-semibold hover:border-purple-500"
            />

            {/* Password fields */}
            <div className="flex flex-col gap-y-2">
              <label
                htmlFor="old-password"
                className="text-xl text-white font-semibold"
              >
                Old Password
              </label>
              <div className="relative">
                <input
                  placeholder="********"
                  id="old-password"
                  type={showOldPassword ? 'text' : 'password'}
                  className="bg-[#242424] w-full h-15 rounded-sm border-[#373737] border px-4 pr-12 text-lg text-white font-semibold hover:border-purple-500"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-xl"
                  onClick={() => setShowOldPassword((prev) => !prev)}
                >
                  <i
                    className={`cursor-pointer fa-solid ${
                      showOldPassword ? 'fa-eye' : 'fa-eye-slash'
                    }`}
                  ></i>
                </button>
              </div>

              <label
                htmlFor="new-password"
                className="text-xl text-white font-semibold"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  placeholder="********"
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  className="bg-[#242424] w-full h-15 rounded-sm border-[#373737] border px-4 pr-12 text-lg text-white font-semibold hover:border-purple-500"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-xl"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                >
                  <i
                    className={`cursor-pointer fa-solid ${
                      showNewPassword ? 'fa-eye' : 'fa-eye-slash'
                    }`}
                  ></i>
                </button>
              </div>

              <label
                htmlFor="re-password"
                className="text-xl text-white font-semibold"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  placeholder="********"
                  id="re-password"
                  type={showRePassword ? 'text' : 'password'}
                  className="bg-[#242424] w-full h-15 rounded-sm border-[#373737] border px-4 pr-12 text-lg text-white font-semibold hover:border-purple-500"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-xl"
                  onClick={() => setShowRePassword((prev) => !prev)}
                >
                  <i
                    className={`cursor-pointer fa-solid ${
                      showRePassword ? 'fa-eye' : 'fa-eye-slash'
                    }`}
                  ></i>
                </button>
              </div>

              {/* Role Selection */}
              <div className="w-full flex flex-col gap-y-2 text-white">
                <span className="block text-xl font-semibold text-white">
                  Role
                </span>

                <label className="flex items-start gap-4 p-4 rounded-md border border-gray-600 cursor-pointer hover:border-purple-500">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={role === 'admin'}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-1 accent-purple-600"
                  />
                  <div>
                    <span className="block text-lg font-semibold">
                      Administrator
                    </span>
                    <span className="text-sm text-gray-400">
                      Administrators can do everything, including managing users
                      and deleting current administrators.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-4 p-4 rounded-md border border-gray-600 cursor-pointer hover:border-purple-500">
                  <input
                    type="radio"
                    name="role"
                    value="staff"
                    checked={role === 'staff'}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-1 accent-purple-600"
                  />
                  <div>
                    <span className="block text-lg font-semibold">Staff</span>
                    <span className="text-sm text-gray-400">
                      Staff members cannot view logs and edit users. Reviewers
                      can manage all transactions.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="w-full min-h-15 bg-[#373737] flex px-5 justify-end">
            <div className="w-fit h-15 flex items-center gap-x-2">
              <button
                type="button"
                onClick={onClose}
                className="hover:ring-3 w-30 h-8 bg-[#3A3A3A] border flex items-center justify-center border-white rounded cursor-pointer"
              >
                <span className="text-white text-xl font-semibold">Cancel</span>
              </button>
              <button
                type="button"                     // no longer submits
                   onClick={() => setConfirmation(true)}
                className="hover:ring-3 w-30 h-8 bg-[#6F3FFF] border flex items-center justify-center border-white rounded-sm cursor-pointer"
              >
                <span className="text-white text-xl font-semibold">Save</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default UserUpdate
